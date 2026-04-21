import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const BASE = 'https://game-room-api.fly.dev'

async function apiCreateRoom(initialState){
  const res = await fetch(`${BASE}/api/rooms`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initialState })
  });
  if(!res.ok) throw new Error('Failed to create room');
  return res.json();
}

async function apiGetRoom(roomId){
  const res = await fetch(`${BASE}/api/rooms/${roomId}`);
  if(!res.ok) throw new Error('Room not found');
  return res.json();
}

async function apiUpdateRoom(roomId, gameState){
  const res = await fetch(`${BASE}/api/rooms/${roomId}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameState })
  });
  if(!res.ok) throw new Error('Failed to update room');
  return res.json();
}

export function useGameRoom(options){
	const [roomId, setRoomId] = useState(null);
	const qc = useQueryClient();

	const { data: state, isLoading, error } = useQuery({
		queryKey: ['room', roomId],
		queryFn: () => apiGetRoom(roomId).then(r => r.gameState),
		enabled: !!roomId,
		refetchInterval: options?.refetchInterval ?? 800,
	});

	const createRoom = useMutation({
		mutationFn: apiCreateRoom,
		onSuccess: ({ roomId: rId, gameState }) => {
			setRoomId(rId);
			qc.setQueryData(['room', rId], gameState);
		}
	});

	const pushState = useMutation({
		mutationFn: async (next) => {
			if(!roomId) throw new Error('No room');
			const latest = await apiGetRoom(roomId);
			const version = (latest.gameState?.version ?? 0) + 1;
			const merged = { ...next, version };
			const updated = await apiUpdateRoom(roomId, merged);
			return updated.gameState;
		},
		onSuccess: (gameState) => {
			if(roomId) qc.setQueryData(['room', roomId], gameState);
		}
	});

	return {
		roomId,
		state,
		isLoading,
		error,
		setRoomId,
		createRoom: (initialState) => createRoom.mutateAsync(initialState),
		pushState: (next) => pushState.mutateAsync(next),
	};
}
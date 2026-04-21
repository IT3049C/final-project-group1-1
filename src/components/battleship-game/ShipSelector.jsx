export function ShipSelector({setSelectedShip, setIsHorizontal}){
	return(
		<div id="ship-placer">
			<div id="orientation-picker">
				<button onClick={() => setIsHorizontal(true)}>Horizontal ↔️</button>
				<button onClick={() => setIsHorizontal(false)}>Vertical ↕️</button>
			</div>
			<div id="ship-selector">
				<div>
					<button onClick={() => setSelectedShip(`Carrier`)}>Carrier 🟥 🟥 🟥 🟥 🟥</button>
				</div>
				<div>
					<button onClick={() => setSelectedShip(`Battleship`)}>Battleship 🟥 🟥 🟥 🟥</button>
				</div>
				<div>
					<button onClick={() => setSelectedShip(`Cruiser`)}>Cruiser 🟥 🟥 🟥</button>
				</div>
				<div>
					<button onClick={() => setSelectedShip(`Submarine`)}>Submarine 🟥 🟥 🟥</button>
				</div>
				<div>
					<button onClick={() => setSelectedShip(`Destroyer`)}>Destroyer 🟥 🟥</button>
				</div>
			</div>
		</div>
	)
}
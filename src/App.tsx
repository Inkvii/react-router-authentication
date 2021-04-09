import React from 'react'
import {BrowserRouter} from "react-router-dom"
import RouteSwitcher from "router/RouteSwitcher"

function App() {
	return (
		<div>
			<BrowserRouter>
				<RouteSwitcher/>
			</BrowserRouter>
		</div>
	)
}

export default App

import {useHistory} from "react-router-dom"
import {PATH_ROUTES} from "router/routes"
import {tokenAuthenticationProvider} from "authentication/TokenAuthenticationProvider"

export default function Menu() {
	const history = useHistory()


	const createMenuItem = (name: string, url: string) => {
		return <button onClick={() => history.push(url)}>{name}</button>
	}

	const logout = () => {
		tokenAuthenticationProvider.logout()
		history.push("/")
	}

	return (
		<div style={{marginBottom: 20}}>
			<ul>
				<li>{createMenuItem(PATH_ROUTES.freePage.name, PATH_ROUTES.freePage.uri)}</li>
				<li>{createMenuItem(PATH_ROUTES.adminOnly.name, PATH_ROUTES.adminOnly.uri)}</li>
				<li>{createMenuItem(PATH_ROUTES.tokenOnly.name, PATH_ROUTES.tokenOnly.uri)}</li>
				<li>
					<button onClick={logout}>Logout</button>
				</li>
			</ul>
		</div>
	)
}

import {useState} from "react"
import "styles.css"
import {tokenAuthenticationProvider} from "authentication/TokenAuthenticationProvider"
import {useHistory} from "react-router-dom"

export default function LoginPage() {
	const [username, setUsername] = useState<string>("admin")
	const [password, setPassword] = useState<string>("pass")

	const history = useHistory()

	const login = () => {
		tokenAuthenticationProvider.requestNewTokenFromBackend({username, password})
			.then(() => {
				console.debug("Refreshing page")
				history.push(history.location)
			}).catch(error => {
			console.error("Could not login " + error)
		})
	}

	return (
		<div className={"box-column"}>
			<input type={"text"} value={username} onChange={(e) => setUsername(e.target.value)}/>
			<input type={"password"} value={password} onChange={(e) => setPassword(e.target.value)}/>
			<button onClick={login}>Login</button>
		</div>
	)
}

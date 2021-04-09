import {Route, Switch} from "react-router-dom"
import Menu from "component/Menu"
import {PATH_ROUTES} from "router/routes"
import LoginPage from "pages/LoginPage"
import UnauthorizedPage from "pages/UnauthorizedPage"

interface Props {
	tokenIsValid: boolean,
	userHasPermissionToViewPage: boolean,

}

export default function RouteHandler(props: Props) {

	/**
	 * Security method that prevents user from accessing pages they dont have permission to view.
	 * Permissions for viewing page are declared in PATH_ROUTES and must match permissions that are on the token
	 */
	if (!props.userHasPermissionToViewPage && props.tokenIsValid) {
		return <UnauthorizedPage/>
	}


	/**
	 * Security method that prevents user from accessing pages if they have no/invalid token.
	 * If triggered, will show login page (but wont redirect user)
	 */
	if (!props.tokenIsValid && !props.userHasPermissionToViewPage) {
		console.info("Authentication token is empty. Showing login page")
		return <LoginPage/>
	}
	console.info("Authentication token is set, loading storage")


	console.info("User has permission to view page")


	return (
		<>
			<Menu/>
			<Switch>
				<Route exact path={PATH_ROUTES.freePage.uri} component={PATH_ROUTES.freePage.component}/>
				<Route exact path={PATH_ROUTES.tokenOnly.uri} component={PATH_ROUTES.tokenOnly.component}/>
				<Route exact path={PATH_ROUTES.adminOnly.uri} component={PATH_ROUTES.adminOnly.component}/>
				<Route exact path={PATH_ROUTES.login.uri} component={PATH_ROUTES.login.component}/>
			</Switch>
		</>
	)
}

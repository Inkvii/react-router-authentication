import RouteHandler from "router/RouteHandler"
import {useLocation} from "react-router-dom"
import {useEffect, useState} from "react"
import {AuthenticationToken, tokenAuthenticationProvider} from "authentication/TokenAuthenticationProvider"
import {PATH_ROUTES} from "router/routes"

export default function RouteSwitcher() {
	const [authenticationToken, setAuthenticationToken] = useState<AuthenticationToken | null>(null)
	const [userHasPermissionToViewPage, setUserHasPermissionToViewPage] = useState(false)
	const location = useLocation()

	/**
	 * Method sets permission to view page.
	 * Method firstly checks if page has any permissions.
	 * If page needs permission, method checks provided token if it contains the permission.
	 *
	 * In case that route has no permissions, no checks are made against token.
	 *
	 * 1) check route exists
	 * 2) check that route needs user to be logged in
	 * 3) check user's token if they have permission
	 *
	 *
	 * @param token token for checking permissions against the page user wants to visit
	 */
	const setIfUserCanViewPage = (token: AuthenticationToken | null) => {
		console.group("setIfUserCanViewPage")
		console.debug("Location " + location.pathname)
		const route = Object.values(PATH_ROUTES).find(route => location.pathname === route.uri)
		if (route && token !== null) {
			console.debug(`Route ${route.uri} exists and token is valid`)
			let isPermissionFound: boolean
			if (route.permissions.length > 0) {
				console.debug("Checking if user is allowed to view page " + location.pathname)
				isPermissionFound = route.permissions.every((val) => token.permissions.includes(val))
			} else {
				console.debug("Page has no permission restrictions")
				isPermissionFound = true
			}

			isPermissionFound ? console.debug("Permission is granted") : console.warn("Permission denied")
			setUserHasPermissionToViewPage(isPermissionFound)
		} else {
			console.debug("User does not have permission to view this page")
			setUserHasPermissionToViewPage(false)
		}
		console.groupEnd()
	}

	useEffect(() => {
		tokenAuthenticationProvider.getAuthenticationToken().then(token => {
			setAuthenticationToken(token)
			setIfUserCanViewPage(token)
		})
	}, [location])

	return (
		<RouteHandler tokenIsValid={authenticationToken !== null} userHasPermissionToViewPage={userHasPermissionToViewPage}/>
	)
}

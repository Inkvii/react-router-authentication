import FreePage from "pages/FreePage"
import AccessibleOnlyWithToken from "pages/AccessibleOnlyWithToken"
import AdminOnlyPage from "pages/AdminOnlyPage"
import LoginPage from "pages/LoginPage"
import {Permission} from "authentication/Permission"


export const PATH_ROUTES = {
	"freePage": {
		uri: "/",
		name: "Free access",
		component: FreePage,
		isLoginRequired: false,
		permissions: []
	},
	"tokenOnly": {
		uri: "/token",
		name: "With token",
		component: AccessibleOnlyWithToken,
		isLoginRequired: true,
		permissions: [Permission.ONLY_WITH_TOKEN]
	},
	"adminOnly": {
		uri: "/admin",
		name: "Admin only",
		component: AdminOnlyPage,
		isLoginRequired: true,
		permissions: [Permission.ADMIN, Permission.ONLY_WITH_TOKEN]
	},
	"login": {
		uri: "/login",
		name: "Login",
		component: LoginPage,
		isLoginRequired: false,
		permissions: []
	}
}

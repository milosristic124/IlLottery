
import Welcome from "../containers/Welcome";
import Loader from "../components/common/Loader";
import Signup from "../containers/Signup";
import Login from "../containers/Login";
import AgeNotVerified from "../containers/AgeNotVerified";
import Typeform from "../containers/Typeform";
import Home from "../containers/Home";
// export list of routes.
export default routes = {
	Loader : { screen: Loader },
	Welcome	: { screen: Welcome },
	Signup	: { screen: Signup },
	Login	: { screen: Login },
	AgeNotVerified: { screen: AgeNotVerified },
	Typeform: { screen: Typeform },
	Home: { screen: Home }
};

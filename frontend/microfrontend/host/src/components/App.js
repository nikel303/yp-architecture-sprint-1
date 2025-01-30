import React, {lazy, Suspense, useEffect} from "react";
import {Route, Switch, useHistory} from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import ProtectedRoute from "./ProtectedRoute";

const Register = lazy(() => import('auth/Register'));
const Login = lazy(() => import('auth/Login'));
const authApi = lazy(() => import('auth/Api'));

const InfoTooltip = lazy(async () => await import('ui/InfoTooltip'));

function App() {

    // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
    const [currentUser, setCurrentUser] = React.useState({});

    const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
    const [tooltipStatus, setTooltipStatus] = React.useState("");

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    //В компоненты добавлены новые стейт-переменные: email — в компонент App
    const [email, setEmail] = React.useState("");

    const history = useHistory();

    const onUserUpdated = (e) => {
        handleOnUserUpdate(e.user);
    }

    const handleOnUserUpdate = (user) => {
        setCurrentUser(user);
    }

    useEffect(() => {
        addEventListener("onUserUpdated", onUserUpdated)
        return () => {
            removeEventListener("onUserUpdated", onUserUpdated)
        }
    }, []);

    // при монтировании App описан эффект, проверяющий наличие токена и его валидности
    React.useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            authApi
                .checkToken(token)
                .then((res) => {
                    setEmail(res.data.email);
                    setIsLoggedIn(true);
                    history.push("/");
                })
                .catch((err) => {
                    localStorage.removeItem("jwt");
                    console.log(err);
                });
        }
    }, [history]);

    function closeAllPopups() {
        setIsInfoToolTipOpen(false);
    }

    function handleOnRegister() {
        setTooltipStatus("success");
        setIsInfoToolTipOpen(true);
        history.push("/signin");
    }

    function handleOnRegisterFail() {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
    }

    function handleOnLogin({email, password}) {
        setIsLoggedIn(true);
        setEmail(email);
        history.push("/");
    }

    function handleOnLoginFail() {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
    }

    function onSignOut() {
        // при вызове обработчика onSignOut происходит удаление jwt
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        // После успешного вызова обработчика onSignOut происходит редирект на /signin
        history.push("/signin");
    }

    return (
        // В компонент App внедрён контекст через CurrentUserContext.Provider
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page__content">
                <Header email={email} onSignOut={onSignOut}/>
                <Switch>
                    <ProtectedRoute
                        exact
                        path="/"
                        component={Main}
                        loggedIn={isLoggedIn}
                    />
                    <Route path="/signup">
                        <Suspense>
                            <Register/>
                        </Suspense>
                    </Route>
                    <Route path="/signin">
                        <Suspense>
                            <Login/>
                        </Suspense>
                    </Route>
                </Switch>
                <Footer/>
                <Suspense>
                    <InfoTooltip
                        isOpen={isInfoToolTipOpen}
                        onClose={closeAllPopups}
                        status={tooltipStatus}
                    />
                </Suspense>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
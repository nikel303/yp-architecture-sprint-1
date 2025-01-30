import React, {lazy, Suspense} from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

const Profile = lazy(() => import('profile/Profile'));
const Places = lazy(() => import('places/Places'));

function Main() {
    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="page__section">
                <Suspense>
                    <Profile currentUser={currentUser}/>
                </Suspense>
            </section>
            <section className="page__section">
                <Suspense>
                    <Places currentUser={currentUser}/>
                </Suspense>
            </section>
        </main>
    );
}

export default Main;
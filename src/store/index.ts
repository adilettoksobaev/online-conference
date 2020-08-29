import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';


import * as AuthActions from './Auth/actions';
import * as AccountActions from './Account/actions';
import * as ConferencesActions from './Conferences/actions';

export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const actions = {
    auth: AuthActions,
    account: AccountActions,
    conferences: ConferencesActions,
}

export type RootState = StateType<typeof rootReducer>;

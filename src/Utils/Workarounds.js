import { avail } from './index';

export const userStateToUser = state => (avail(state.id) ? state : state.id);

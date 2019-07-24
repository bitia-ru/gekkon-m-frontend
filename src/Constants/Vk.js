import { ApiUrl } from '../Environ';
import ClientId from '../ClientId';

export const CLIENT_ID = ClientId;
export const REDIRECT_URI = `${ApiUrl}/v1/integrations/vk/callbacks/oauth2`;

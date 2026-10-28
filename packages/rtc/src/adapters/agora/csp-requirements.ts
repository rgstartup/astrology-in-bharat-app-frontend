import requirements from "./csp-requirements.json";

/**
 * Agora Web SDK HTTPS signaling and transport sources required by apps that
 * enforce a Content Security Policy. Add `connectSrc` to the `connect-src`
 * directive.
 */
export const AGORA_CSP_REQUIREMENTS = requirements;

export default requirements;

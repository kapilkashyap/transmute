export async function saveProfile(payload) {
    console.log('[04-full-form-flow] save payload', payload);
    return { ok: true, saved: payload };
}

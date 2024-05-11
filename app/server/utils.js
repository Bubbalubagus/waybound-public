'use server';

export async function fetchDestinations() {
    const accessKey = "";
    const baseUrl = "https://api.viator.com/partner/v1/taxonomy/destinations";
    const headers = {
        "Accept-Language": "en-US",
        "exp-api-key": accessKey,
    }

    const viatorDestinations = await fetch(`${baseUrl}`, { headers })
    const allDestinations = (await viatorDestinations.json()).data;

    return allDestinations;
}
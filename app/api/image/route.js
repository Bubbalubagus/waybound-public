const accessKey = '';
const baseUrl = 'https://api.unsplash.com/';

async function searchImages(query) {
    const searchEndpoint = 'search/photos';
    const params = new URLSearchParams({
        query,
        client_id: accessKey,
    });

    const url = `${baseUrl}${searchEndpoint}?${params}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            const firstImageUrl = data.results[0].urls.regular;
            return firstImageUrl;
        } else {
            console.error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Given a destination, return an image URL from Unsplash
export async function POST(req) {
    const { destination } = await req.json();
    const imageUrl = await searchImages(destination);
    return Response.json({ imageUrl });
}
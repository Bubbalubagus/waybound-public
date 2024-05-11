// pages/api/destinations.js
import axios from "axios";

const accessKey = "be0f36d7-8343-4744-b1a1-6516b685cb5f";
const baseUrl = "https://api.viator.com/partner/v1/taxonomy/destinations";
const attractionsBaseUrl =
  "https://api.viator.com/partner/v1/taxonomy/attractions";

async function fetchDestinations() {
  console.log(`Fetching destinations from: ${baseUrl}`);

  try {
    const response = await axios.get(baseUrl, {
      headers: {
        "Accept-Language": "en-US",
        "exp-api-key": accessKey,
      },
    });

    console.log(`Response: ${response.status} ${response.data}`);

    const data = response.data;
    console.log(`Fetched destinations: ${data}`);
    return data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(`Error: ${error}`);
  }
}

async function updateDestinations() {
  const data = await fetchDestinations();
  return data;
}

async function fetchAttractions(destId) {
  try {
    const response = await axios.post(
      attractionsBaseUrl,
      {
        destId,
        topX: "1-100",
        sortOrder: "RECOMMENDED",
      },
      {
        headers: {
          "Accept-Language": "en-US",
          "exp-api-key": accessKey,
        },
      }
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(`Error: ${error}`);
  }
}

// Fetch destinations
export async function GET(req, res) {
  if (req.method === "GET") {
    const data = await updateDestinations();
    return Response.json({ data });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Fetch attractions
export async function POST(req, res) {
  if (req.method === "POST") {
    const { destId } = await req.json();
    const data = await fetchAttractions(destId);
    return Response.json({ data });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

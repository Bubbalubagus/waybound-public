import axios from "axios";
import _ from "lodash";

// Fetch attractions
export async function POST(req, res) {
  if (req.method === "POST") {
    const { destination } = await req.json();
    const viatorActivities = await fetchAttractions(destination.id);
    const googlePlaces = await getGooglePlacesRecommendations(`${destination.name} ${destination.timeZone}`);

    return Response.json({ data: _.shuffle([...viatorActivities, ...googlePlaces]) });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
// Viator API Documentation: https://docs.viator.com/partner-api/technical/ 
//  {
  //   productCode: '',
  //   title: 'Private Edinburgh Photography Tour',
  //   description: 'Don’t limit yourself to just the Royal Mile; the Extended Photo tours take in both the Street Tour and the Night Tour so you can cover more ground and come away with more spectacular images. Let a professional photographer guide you through your setting as they whisk you to their favourite spots to capture the best images in the Capital. We will lead you to superb photographic opportunities for all kinds of subjects, from landmarks and people watching to hidden secrets and great views over the city, all the while offering practical tips and helping you to develop your own creative vision.\n' +
  //     '\n' +
  //     'Each tour is crafted to the skills and needs of the participants. Apart from taking photos, you can also expect to learn:\n' +
  //     '\n' +
  //     'Creative composition, using lines, repetition, camera angles\n' +
  //     'Training your eye: composition, subjects, lighting\n' +
  //     'Taking control of your camera: ƒ-stop, shutter speed, ISO and focusing\n' +
  //     'Night photography basics\n' +
  //     'Long exposure light streaking - cars, boats\n' +
  //     'Reviewing your photography',
  //   images: [Array],
  //   reviews: [Object],
  //   duration: [Object],
  //   confirmationType: 'INSTANT',
  //   itineraryType: 'ACTIVITY',
  //   pricing: [Object],
  //   productUrl: 'https://www.viator.com/tours/Edinburgh/Private-Edinburgh-Photography-Tour-with-a-Professional-Photographer/d739-269213P2?mcid=42383&pid=P00148298&medium=api&api_version=2.0',
  //   destinations: [Array],
  //   tags: [Array],
  //   flags: [Array],
  //   translationInfo: [Object]
  // }
async function fetchAttractions(destId, startDate, endDate) {
  try {
    console.log(`Fetching attractions for dates from ${startDate} to ${endDate}`);
    const accessKey = "";
    const response = await axios.post(
      "https://api.viator.com/partner/products/search",
      {
        "filtering": {
          "destination": destId,
          // "tags": [21972],
          // "flags": ["LIKELY_TO_SELL_OUT", "FREE_CANCELLATION"], // Probably delete this
          "lowestPrice": 5,
          "highestPrice": 9999,
          "startDate": startDate,
          "endDate": endDate,
          "includeAutomaticTranslations": true,
          "confirmationType": "INSTANT",
          "durationInMinutes": {
            "from": 10,
            "to": 1440
          },
          "rating": {
            "from": 3,
            "to": 5
          }
        },
        "sorting": {
          "sort": "TRAVELER_RATING",
          "order": "DESCENDING"
        },
        "pagination": {
          "start": 1,
          "count": 25
        },
        "currency": "USD"
      },
      {
        headers: {
          "Accept-Language": "en-US",
          'Accept': 'application/json;version=2.0',
          "exp-api-key": accessKey,
        },
      }
    );

    const { products } = response.data;

    // For each product in the response, set the mainImage property to images[0].variants[9].url
    // This is the largest image available for each product

    const activities = products.map(product => {
      const images = product.images.slice(0, 6).map(img => img.variants[9]?.url || '');
      //const mainImage = images[0]?.variants[9]?.url || '';

      // Append the affiliate parameters to the productUrl
      const affiliateId = '';
      const affiliateProductUrl = `${product.productUrl}`;
      console.log(affiliateProductUrl)
      // Check if this link is even correct.
      return {
        ...product,
        images,
        rating: product.reviews?.combinedAverageRating || 0,
        productUrl: affiliateProductUrl,
      };
    });

    return activities;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(`Error: ${error}`);
  }
}


async function getGooglePlacesRecommendations(destination) {
  try {
    const recommendations = [];

    const apiKey = '';
    const textSearchApiEndpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const placeDetailsApiEndpoint = 'https://maps.googleapis.com/maps/api/place/details/json';

    const queryParameters = {
      query: `things to do in ${destination}`,
      key: apiKey,
    };

    const textSearchResponse = await axios.get(textSearchApiEndpoint, { params: queryParameters });

    if (textSearchResponse.status === 200) {
      const data = textSearchResponse.data;
      const results = data.results || [];

      for (const result of results) {
        // Stop if we have enough recommendations
        if (recommendations.length >= 10) break;

        const placeId = result.place_id || '';

        const detailsParameters = {
          place_id: placeId,
          fields: 'url,price_level,photos,review,formatted_phone_number,formatted_address,rating',
          key: apiKey,
        };

        const detailsResponse = await axios.get(placeDetailsApiEndpoint, { params: detailsParameters });

        if (detailsResponse.status === 200) {
          const detailsData = detailsResponse.data.result || {};
          const location = result.geometry?.location || {};
          const photos = detailsData.photos || [];
          const reviews = detailsData.reviews || [];

          //const photoUrls = photos.map(photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`);
          const photoUrls = photos.slice(0, 6).map(photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`);

          if (placeId && result.name && detailsData.formatted_address && photoUrls.length > 0) {
            recommendations.push({
              productCode: placeId,
              title: result.name,
              description: detailsData.formatted_address,
              images: photoUrls,
              reviews,
              productUrl: detailsData.url,
              mainImage: photoUrls[0],
              rating: detailsData.rating,
            });
          }
        } else {
          console.error(`Error in Place Details request: HTTP status code ${detailsResponse.status}`);
        }
      }
    } else {
      console.error(`Error in Text Search request: HTTP status code ${textSearchResponse.status}`);
    }

    return recommendations;
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    return [];
  }
}

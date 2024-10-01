const { MongoClient } = require('mongodb');

 async function main(){
    const uri = "mongodb+srv://handicrafts:test123@cluster0.uohcfax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const client = new MongoClient(uri);

    try {
        
        await client.connect();
        console.log("Connected to MongoDB");

        await finding(client);

    } catch (e) {
        console.error("An error occurred in main:", e);
    } finally {
        
        await client.close();
        console.log("Connection closed");
    }
}

main().catch(console.error);

 async function finding(client,data,coll) {
    try {
        console.log("Data passed to finding function:", data);
        const cursor = client.db("shop").collection(coll).find(data);
        const results = await cursor.toArray();
        if (results.length > 0) {
            return results; 
        } else {
            console.log("No data found.");
            return null; 
        }
    } catch (error) {
        console.error("An error occurred in finding:", error);
    }
}

async function inserting(client, newListing,coll){
    const result = await client.db("shop").collection(coll).insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}
module.exports = { inserting ,finding  };




// const { MongoClient } = require('mongodb');

// async function main() {
//     /**
//      * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//      * See https://docs.mongodb.com/drivers/node/ for more details
//      */
//     const uri = "mongodb+srv://handicrafts:test123@cluster0.uohcfax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//     /**
//      * The Mongo Client you will use to interact with your database
//      * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
//      * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
//      * pass option { useUnifiedTopology: true } to the MongoClient constructor.
//      * const client =  new MongoClient(uri, {useUnifiedTopology: true})
//      */
//     const client = new MongoClient(uri);

//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();
//         console.log("Connected to MongoDB");

//         // Make the appropriate DB calls

//         // Find the listing named "Infinite Views" that we created in create.js
//         await findOneListingByName(client, "Lavendar Candle");

//         // Find up to 5 listings with at least 4 bedrooms and at least 2 bathrooms
//         // If you recently ran create.js, a listing named Beautiful Beach House should be included in the results 
//         // await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
//         //     minimumNumberOfBedrooms: 4,
//         //     minimumNumberOfBathrooms: 2,
//         //     maximumNumberOfResults: 5
//         // });

//     } catch (e) {
//         console.error("An error occurred in main:", e);
//     } finally {
//         // Close the connection to the MongoDB cluster
//         await client.close();
//         console.log("Connection closed");
//     }
    
// }

// main().catch(console.error);

// /**
//  * Print an Airbnb listing with the given name
//  * Note: If more than one listing has the same name, only the first listing the database finds will be printed.
//  * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
//  * @param {String} nameOfListing The name of the listing you want to find
//  */
// async function findOneListingByName(client, nameOfListing) {
//     // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
//     const result = await client.db("shop").collection("itemsdatas").findOne({ itemName: nameOfListing });

//     if (result) {
//         console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
//         console.log(result);
//     } else {
//         console.log(`No listings found with the name '${nameOfListing}'`);
//     }
// }

// /**
//  * Print Airbnb listings with a minimum number of bedrooms and bathrooms.
//  * Results will be limited to the designated maximum number of results.
//  * Results will be sorted by the date of the last review in descending order.
//  * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
//  * @param {object} queryParams The query params object
//  * @param {number} queryParams.minimumNumberOfBedrooms The minimum number of bedrooms
//  * @param {number} queryParams.minimumNumberOfBathrooms The minimum number of bathrooms
//  * @param {number} queryParams.maximumNumberOfResults The maximum number of Airbnb listings to be printed
//  */
// async function finding(client, {
//     } = {}) {

//     // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find for the find() docs
//     const cursor = client.db("sample_airbnb").collection("listingsAndReviews")
//         .find({
//             bedrooms: { $gte: minimumNumberOfBedrooms },
//             bathrooms: { $gte: minimumNumberOfBathrooms }
//         }
//         )
//         .sort({ last_review: -1 })
//         .limit(maximumNumberOfResults);

//     // Store the results in an array
//     const results = await cursor.toArray();

//     // Print the results
//     if (results.length > 0) {
//         console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
//         results.forEach((result, i) => {
//             const date = new Date(result.last_review).toDateString();

//             console.log();
//             console.log(`${i + 1}. name: ${result.name}`);
//             console.log(`   _id: ${result._id}`);
//             console.log(`   bedrooms: ${result.bedrooms}`);
//             console.log(`   bathrooms: ${result.bathrooms}`);
//             console.log(`   most recent review date: ${date}`);
//         });
//     } else {
//         console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
//     }
// }













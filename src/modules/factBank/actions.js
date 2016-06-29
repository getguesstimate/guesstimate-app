const findFactByName = name => FACTS.find(f => f.name === name)

export function nounSearch(partialNoun) {
  return FACTS.map(f => f.name).filter(name => name.startsWith(partialNoun))
}

export function propertySearch(noun, partialProperty) {
  return Object.keys(findFactByName(noun)).filter(property => property.startsWith(partialProperty))
}

export function resolveProperty([noun, property]) {
  return findFactByName(noun)[property]
}

const FACTS = [
    {
        "name": "New_York", 
        "growth_from_2000_to_2013": "4.8%", 
        "latitude": 40.7127837, 
        "longitude": -74.0059413, 
        "population": "8405837", 
        "rank": "1", 
        "state": "New_York"
    }, 
    {
        "name": "Los_Angeles", 
        "growth_from_2000_to_2013": "4.8%", 
        "latitude": 34.0522342, 
        "longitude": -118.2436849, 
        "population": "3884307", 
        "rank": "2", 
        "state": "California"
    }, 
    {
        "name": "Chicago", 
        "growth_from_2000_to_2013": "-6.1%", 
        "latitude": 41.8781136, 
        "longitude": -87.6297982, 
        "population": "2718782", 
        "rank": "3", 
        "state": "Illinois"
    }, 
    {
        "name": "Houston", 
        "growth_from_2000_to_2013": "11.0%", 
        "latitude": 29.7604267, 
        "longitude": -95.3698028, 
        "population": "2195914", 
        "rank": "4", 
        "state": "Texas"
    }, 
    {
        "name": "Philadelphia", 
        "growth_from_2000_to_2013": "2.6%", 
        "latitude": 39.9525839, 
        "longitude": -75.1652215, 
        "population": "1553165", 
        "rank": "5", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Phoenix", 
        "growth_from_2000_to_2013": "14.0%", 
        "latitude": 33.4483771, 
        "longitude": -112.0740373, 
        "population": "1513367", 
        "rank": "6", 
        "state": "Arizona"
    }, 
    {
        "name": "San_Antonio", 
        "growth_from_2000_to_2013": "21.0%", 
        "latitude": 29.4241219, 
        "longitude": -98.49362819999999, 
        "population": "1409019", 
        "rank": "7", 
        "state": "Texas"
    }, 
    {
        "name": "San_Diego", 
        "growth_from_2000_to_2013": "10.5%", 
        "latitude": 32.715738, 
        "longitude": -117.1610838, 
        "population": "1355896", 
        "rank": "8", 
        "state": "California"
    }, 
    {
        "name": "Dallas", 
        "growth_from_2000_to_2013": "5.6%", 
        "latitude": 32.7766642, 
        "longitude": -96.79698789999999, 
        "population": "1257676", 
        "rank": "9", 
        "state": "Texas"
    }, 
    {
        "name": "San_Jose", 
        "growth_from_2000_to_2013": "10.5%", 
        "latitude": 37.3382082, 
        "longitude": -121.8863286, 
        "population": "998537", 
        "rank": "10", 
        "state": "California"
    }, 
    {
        "name": "Austin", 
        "growth_from_2000_to_2013": "31.7%", 
        "latitude": 30.267153, 
        "longitude": -97.7430608, 
        "population": "885400", 
        "rank": "11", 
        "state": "Texas"
    }, 
    {
        "name": "Indianapolis", 
        "growth_from_2000_to_2013": "7.8%", 
        "latitude": 39.768403, 
        "longitude": -86.158068, 
        "population": "843393", 
        "rank": "12", 
        "state": "Indiana"
    }, 
    {
        "name": "Jacksonville", 
        "growth_from_2000_to_2013": "14.3%", 
        "latitude": 30.3321838, 
        "longitude": -81.65565099999999, 
        "population": "842583", 
        "rank": "13", 
        "state": "Florida"
    }, 
    {
        "name": "San_Francisco", 
        "growth_from_2000_to_2013": "7.7%", 
        "latitude": 37.7749295, 
        "longitude": -122.4194155, 
        "population": "837442", 
        "rank": "14", 
        "state": "California"
    }, 
    {
        "name": "Columbus", 
        "growth_from_2000_to_2013": "14.8%", 
        "latitude": 39.9611755, 
        "longitude": -82.99879419999999, 
        "population": "822553", 
        "rank": "15", 
        "state": "Ohio"
    }, 
    {
        "name": "Charlotte", 
        "growth_from_2000_to_2013": "39.1%", 
        "latitude": 35.2270869, 
        "longitude": -80.8431267, 
        "population": "792862", 
        "rank": "16", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Fort_Worth", 
        "growth_from_2000_to_2013": "45.1%", 
        "latitude": 32.7554883, 
        "longitude": -97.3307658, 
        "population": "792727", 
        "rank": "17", 
        "state": "Texas"
    }, 
    {
        "name": "Detroit", 
        "growth_from_2000_to_2013": "-27.1%", 
        "latitude": 42.331427, 
        "longitude": -83.0457538, 
        "population": "688701", 
        "rank": "18", 
        "state": "Michigan"
    }, 
    {
        "name": "El_Paso", 
        "growth_from_2000_to_2013": "19.4%", 
        "latitude": 31.7775757, 
        "longitude": -106.4424559, 
        "population": "674433", 
        "rank": "19", 
        "state": "Texas"
    }, 
    {
        "name": "Memphis", 
        "growth_from_2000_to_2013": "-5.3%", 
        "latitude": 35.1495343, 
        "longitude": -90.0489801, 
        "population": "653450", 
        "rank": "20", 
        "state": "Tennessee"
    }, 
    {
        "name": "Seattle", 
        "growth_from_2000_to_2013": "15.6%", 
        "latitude": 47.6062095, 
        "longitude": -122.3320708, 
        "population": "652405", 
        "rank": "21", 
        "state": "Washington"
    }, 
    {
        "name": "Denver", 
        "growth_from_2000_to_2013": "16.7%", 
        "latitude": 39.7392358, 
        "longitude": -104.990251, 
        "population": "649495", 
        "rank": "22", 
        "state": "Colorado"
    }, 
    {
        "name": "Washington", 
        "growth_from_2000_to_2013": "13.0%", 
        "latitude": 38.9071923, 
        "longitude": -77.0368707, 
        "population": "646449", 
        "rank": "23", 
        "state": "District of Columbia"
    }, 
    {
        "name": "Boston", 
        "growth_from_2000_to_2013": "9.4%", 
        "latitude": 42.3600825, 
        "longitude": -71.0588801, 
        "population": "645966", 
        "rank": "24", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Nashville-Davidson", 
        "growth_from_2000_to_2013": "16.2%", 
        "latitude": 36.1626638, 
        "longitude": -86.7816016, 
        "population": "634464", 
        "rank": "25", 
        "state": "Tennessee"
    }, 
    {
        "name": "Baltimore", 
        "growth_from_2000_to_2013": "-4.0%", 
        "latitude": 39.2903848, 
        "longitude": -76.6121893, 
        "population": "622104", 
        "rank": "26", 
        "state": "Maryland"
    }, 
    {
        "name": "Oklahoma_City", 
        "growth_from_2000_to_2013": "20.2%", 
        "latitude": 35.4675602, 
        "longitude": -97.5164276, 
        "population": "610613", 
        "rank": "27", 
        "state": "Oklahoma"
    }, 
    {
        "name": "Louisville/Jefferson County", 
        "growth_from_2000_to_2013": "10.0%", 
        "latitude": 38.2526647, 
        "longitude": -85.7584557, 
        "population": "609893", 
        "rank": "28", 
        "state": "Kentucky"
    }, 
    {
        "name": "Portland", 
        "growth_from_2000_to_2013": "15.0%", 
        "latitude": 45.5230622, 
        "longitude": -122.6764816, 
        "population": "609456", 
        "rank": "29", 
        "state": "Oregon"
    }, 
    {
        "name": "Las_Vegas", 
        "growth_from_2000_to_2013": "24.5%", 
        "latitude": 36.1699412, 
        "longitude": -115.1398296, 
        "population": "603488", 
        "rank": "30", 
        "state": "Nevada"
    }, 
    {
        "name": "Milwaukee", 
        "growth_from_2000_to_2013": "0.3%", 
        "latitude": 43.0389025, 
        "longitude": -87.9064736, 
        "population": "599164", 
        "rank": "31", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Albuquerque", 
        "growth_from_2000_to_2013": "23.5%", 
        "latitude": 35.0853336, 
        "longitude": -106.6055534, 
        "population": "556495", 
        "rank": "32", 
        "state": "New_Mexico"
    }, 
    {
        "name": "Tucson", 
        "growth_from_2000_to_2013": "7.5%", 
        "latitude": 32.2217429, 
        "longitude": -110.926479, 
        "population": "526116", 
        "rank": "33", 
        "state": "Arizona"
    }, 
    {
        "name": "Fresno", 
        "growth_from_2000_to_2013": "18.3%", 
        "latitude": 36.7468422, 
        "longitude": -119.7725868, 
        "population": "509924", 
        "rank": "34", 
        "state": "California"
    }, 
    {
        "name": "Sacramento", 
        "growth_from_2000_to_2013": "17.2%", 
        "latitude": 38.5815719, 
        "longitude": -121.4943996, 
        "population": "479686", 
        "rank": "35", 
        "state": "California"
    }, 
    {
        "name": "Long_Beach", 
        "growth_from_2000_to_2013": "1.5%", 
        "latitude": 33.7700504, 
        "longitude": -118.1937395, 
        "population": "469428", 
        "rank": "36", 
        "state": "California"
    }, 
    {
        "name": "Kansas_City", 
        "growth_from_2000_to_2013": "5.5%", 
        "latitude": 39.0997265, 
        "longitude": -94.5785667, 
        "population": "467007", 
        "rank": "37", 
        "state": "Missouri"
    }, 
    {
        "name": "Mesa", 
        "growth_from_2000_to_2013": "13.5%", 
        "latitude": 33.4151843, 
        "longitude": -111.8314724, 
        "population": "457587", 
        "rank": "38", 
        "state": "Arizona"
    }, 
    {
        "name": "Virginia_Beach", 
        "growth_from_2000_to_2013": "5.1%", 
        "latitude": 36.8529263, 
        "longitude": -75.97798499999999, 
        "population": "448479", 
        "rank": "39", 
        "state": "Virginia"
    }, 
    {
        "name": "Atlanta", 
        "growth_from_2000_to_2013": "6.2%", 
        "latitude": 33.7489954, 
        "longitude": -84.3879824, 
        "population": "447841", 
        "rank": "40", 
        "state": "Georgia"
    }, 
    {
        "name": "Colorado_Springs", 
        "growth_from_2000_to_2013": "21.4%", 
        "latitude": 38.8338816, 
        "longitude": -104.8213634, 
        "population": "439886", 
        "rank": "41", 
        "state": "Colorado"
    }, 
    {
        "name": "Omaha", 
        "growth_from_2000_to_2013": "5.9%", 
        "latitude": 41.2523634, 
        "longitude": -95.99798829999999, 
        "population": "434353", 
        "rank": "42", 
        "state": "Nebraska"
    }, 
    {
        "name": "Raleigh", 
        "growth_from_2000_to_2013": "48.7%", 
        "latitude": 35.7795897, 
        "longitude": -78.6381787, 
        "population": "431746", 
        "rank": "43", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Miami", 
        "growth_from_2000_to_2013": "14.9%", 
        "latitude": 25.7616798, 
        "longitude": -80.1917902, 
        "population": "417650", 
        "rank": "44", 
        "state": "Florida"
    }, 
    {
        "name": "Oakland", 
        "growth_from_2000_to_2013": "1.3%", 
        "latitude": 37.8043637, 
        "longitude": -122.2711137, 
        "population": "406253", 
        "rank": "45", 
        "state": "California"
    }, 
    {
        "name": "Minneapolis", 
        "growth_from_2000_to_2013": "4.5%", 
        "latitude": 44.977753, 
        "longitude": -93.2650108, 
        "population": "400070", 
        "rank": "46", 
        "state": "Minnesota"
    }, 
    {
        "name": "Tulsa", 
        "growth_from_2000_to_2013": "1.3%", 
        "latitude": 36.1539816, 
        "longitude": -95.99277500000001, 
        "population": "398121", 
        "rank": "47", 
        "state": "Oklahoma"
    }, 
    {
        "name": "Cleveland", 
        "growth_from_2000_to_2013": "-18.1%", 
        "latitude": 41.49932, 
        "longitude": -81.6943605, 
        "population": "390113", 
        "rank": "48", 
        "state": "Ohio"
    }, 
    {
        "name": "Wichita", 
        "growth_from_2000_to_2013": "9.7%", 
        "latitude": 37.688889, 
        "longitude": -97.336111, 
        "population": "386552", 
        "rank": "49", 
        "state": "Kansas"
    }, 
    {
        "name": "Arlington", 
        "growth_from_2000_to_2013": "13.3%", 
        "latitude": 32.735687, 
        "longitude": -97.10806559999999, 
        "population": "379577", 
        "rank": "50", 
        "state": "Texas"
    }, 
    {
        "name": "New_Orleans", 
        "growth_from_2000_to_2013": "-21.6%", 
        "latitude": 29.95106579999999, 
        "longitude": -90.0715323, 
        "population": "378715", 
        "rank": "51", 
        "state": "Louisiana"
    }, 
    {
        "name": "Bakersfield", 
        "growth_from_2000_to_2013": "48.4%", 
        "latitude": 35.3732921, 
        "longitude": -119.0187125, 
        "population": "363630", 
        "rank": "52", 
        "state": "California"
    }, 
    {
        "name": "Tampa", 
        "growth_from_2000_to_2013": "16.0%", 
        "latitude": 27.950575, 
        "longitude": -82.4571776, 
        "population": "352957", 
        "rank": "53", 
        "state": "Florida"
    }, 
    {
        "name": "Honolulu", 
        "growth_from_2000_to_2013": "-6.2%", 
        "latitude": 21.3069444, 
        "longitude": -157.8583333, 
        "population": "347884", 
        "rank": "54", 
        "state": "Hawaii"
    }, 
    {
        "name": "Aurora", 
        "growth_from_2000_to_2013": "24.4%", 
        "latitude": 39.7294319, 
        "longitude": -104.8319195, 
        "population": "345803", 
        "rank": "55", 
        "state": "Colorado"
    }, 
    {
        "name": "Anaheim", 
        "growth_from_2000_to_2013": "4.7%", 
        "latitude": 33.8352932, 
        "longitude": -117.9145036, 
        "population": "345012", 
        "rank": "56", 
        "state": "California"
    }, 
    {
        "name": "Santa_Ana", 
        "growth_from_2000_to_2013": "-1.2%", 
        "latitude": 33.7455731, 
        "longitude": -117.8678338, 
        "population": "334227", 
        "rank": "57", 
        "state": "California"
    }, 
    {
        "name": "St. Louis", 
        "growth_from_2000_to_2013": "-8.2%", 
        "latitude": 38.6270025, 
        "longitude": -90.19940419999999, 
        "population": "318416", 
        "rank": "58", 
        "state": "Missouri"
    }, 
    {
        "name": "Riverside", 
        "growth_from_2000_to_2013": "22.5%", 
        "latitude": 33.9533487, 
        "longitude": -117.3961564, 
        "population": "316619", 
        "rank": "59", 
        "state": "California"
    }, 
    {
        "name": "Corpus_Christi", 
        "growth_from_2000_to_2013": "14.1%", 
        "latitude": 27.8005828, 
        "longitude": -97.39638099999999, 
        "population": "316381", 
        "rank": "60", 
        "state": "Texas"
    }, 
    {
        "name": "Lexington-Fayette", 
        "growth_from_2000_to_2013": "18.0%", 
        "latitude": 38.0405837, 
        "longitude": -84.5037164, 
        "population": "308428", 
        "rank": "61", 
        "state": "Kentucky"
    }, 
    {
        "name": "Pittsburgh", 
        "growth_from_2000_to_2013": "-8.3%", 
        "latitude": 40.44062479999999, 
        "longitude": -79.9958864, 
        "population": "305841", 
        "rank": "62", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Anchorage", 
        "growth_from_2000_to_2013": "15.4%", 
        "latitude": 61.2180556, 
        "longitude": -149.9002778, 
        "population": "300950", 
        "rank": "63", 
        "state": "Alaska"
    }, 
    {
        "name": "Stockton", 
        "growth_from_2000_to_2013": "21.8%", 
        "latitude": 37.9577016, 
        "longitude": -121.2907796, 
        "population": "298118", 
        "rank": "64", 
        "state": "California"
    }, 
    {
        "name": "Cincinnati", 
        "growth_from_2000_to_2013": "-10.1%", 
        "latitude": 39.1031182, 
        "longitude": -84.5120196, 
        "population": "297517", 
        "rank": "65", 
        "state": "Ohio"
    }, 
    {
        "name": "St. Paul", 
        "growth_from_2000_to_2013": "2.8%", 
        "latitude": 44.9537029, 
        "longitude": -93.0899578, 
        "population": "294873", 
        "rank": "66", 
        "state": "Minnesota"
    }, 
    {
        "name": "Toledo", 
        "growth_from_2000_to_2013": "-10.0%", 
        "latitude": 41.6639383, 
        "longitude": -83.55521200000001, 
        "population": "282313", 
        "rank": "67", 
        "state": "Ohio"
    }, 
    {
        "name": "Greensboro", 
        "growth_from_2000_to_2013": "22.3%", 
        "latitude": 36.0726354, 
        "longitude": -79.7919754, 
        "population": "279639", 
        "rank": "68", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Newark", 
        "growth_from_2000_to_2013": "2.1%", 
        "latitude": 40.735657, 
        "longitude": -74.1723667, 
        "population": "278427", 
        "rank": "69", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Plano", 
        "growth_from_2000_to_2013": "22.4%", 
        "latitude": 33.0198431, 
        "longitude": -96.6988856, 
        "population": "274409", 
        "rank": "70", 
        "state": "Texas"
    }, 
    {
        "name": "Henderson", 
        "growth_from_2000_to_2013": "51.0%", 
        "latitude": 36.0395247, 
        "longitude": -114.9817213, 
        "population": "270811", 
        "rank": "71", 
        "state": "Nevada"
    }, 
    {
        "name": "Lincoln", 
        "growth_from_2000_to_2013": "18.0%", 
        "latitude": 40.8257625, 
        "longitude": -96.6851982, 
        "population": "268738", 
        "rank": "72", 
        "state": "Nebraska"
    }, 
    {
        "name": "Buffalo", 
        "growth_from_2000_to_2013": "-11.3%", 
        "latitude": 42.88644679999999, 
        "longitude": -78.8783689, 
        "population": "258959", 
        "rank": "73", 
        "state": "New_York"
    }, 
    {
        "name": "Jersey_City", 
        "growth_from_2000_to_2013": "7.2%", 
        "latitude": 40.72815749999999, 
        "longitude": -74.0776417, 
        "population": "257342", 
        "rank": "74", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Chula_Vista", 
        "growth_from_2000_to_2013": "46.2%", 
        "latitude": 32.6400541, 
        "longitude": -117.0841955, 
        "population": "256780", 
        "rank": "75", 
        "state": "California"
    }, 
    {
        "name": "Fort_Wayne", 
        "growth_from_2000_to_2013": "1.0%", 
        "latitude": 41.079273, 
        "longitude": -85.1393513, 
        "population": "256496", 
        "rank": "76", 
        "state": "Indiana"
    }, 
    {
        "name": "Orlando", 
        "growth_from_2000_to_2013": "31.2%", 
        "latitude": 28.5383355, 
        "longitude": -81.3792365, 
        "population": "255483", 
        "rank": "77", 
        "state": "Florida"
    }, 
    {
        "name": "St. Petersburg", 
        "growth_from_2000_to_2013": "0.3%", 
        "latitude": 27.773056, 
        "longitude": -82.64, 
        "population": "249688", 
        "rank": "78", 
        "state": "Florida"
    }, 
    {
        "name": "Chandler", 
        "growth_from_2000_to_2013": "38.7%", 
        "latitude": 33.3061605, 
        "longitude": -111.8412502, 
        "population": "249146", 
        "rank": "79", 
        "state": "Arizona"
    }, 
    {
        "name": "Laredo", 
        "growth_from_2000_to_2013": "38.2%", 
        "latitude": 27.5305671, 
        "longitude": -99.48032409999999, 
        "population": "248142", 
        "rank": "80", 
        "state": "Texas"
    }, 
    {
        "name": "Norfolk", 
        "growth_from_2000_to_2013": "5.0%", 
        "latitude": 36.8507689, 
        "longitude": -76.28587259999999, 
        "population": "246139", 
        "rank": "81", 
        "state": "Virginia"
    }, 
    {
        "name": "Durham", 
        "growth_from_2000_to_2013": "29.9%", 
        "latitude": 35.9940329, 
        "longitude": -78.898619, 
        "population": "245475", 
        "rank": "82", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Madison", 
        "growth_from_2000_to_2013": "15.8%", 
        "latitude": 43.0730517, 
        "longitude": -89.4012302, 
        "population": "243344", 
        "rank": "83", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Lubbock", 
        "growth_from_2000_to_2013": "19.6%", 
        "latitude": 33.5778631, 
        "longitude": -101.8551665, 
        "population": "239538", 
        "rank": "84", 
        "state": "Texas"
    }, 
    {
        "name": "Irvine", 
        "growth_from_2000_to_2013": "61.3%", 
        "latitude": 33.6839473, 
        "longitude": -117.7946942, 
        "population": "236716", 
        "rank": "85", 
        "state": "California"
    }, 
    {
        "name": "Winston-Salem", 
        "growth_from_2000_to_2013": "16.9%", 
        "latitude": 36.09985959999999, 
        "longitude": -80.244216, 
        "population": "236441", 
        "rank": "86", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Glendale", 
        "growth_from_2000_to_2013": "5.7%", 
        "latitude": 33.5386523, 
        "longitude": -112.1859866, 
        "population": "234632", 
        "rank": "87", 
        "state": "Arizona"
    }, 
    {
        "name": "Garland", 
        "growth_from_2000_to_2013": "8.5%", 
        "latitude": 32.912624, 
        "longitude": -96.63888329999999, 
        "population": "234566", 
        "rank": "88", 
        "state": "Texas"
    }, 
    {
        "name": "Hialeah", 
        "growth_from_2000_to_2013": "3.2%", 
        "latitude": 25.8575963, 
        "longitude": -80.2781057, 
        "population": "233394", 
        "rank": "89", 
        "state": "Florida"
    }, 
    {
        "name": "Reno", 
        "growth_from_2000_to_2013": "26.8%", 
        "latitude": 39.5296329, 
        "longitude": -119.8138027, 
        "population": "233294", 
        "rank": "90", 
        "state": "Nevada"
    }, 
    {
        "name": "Chesapeake", 
        "growth_from_2000_to_2013": "15.1%", 
        "latitude": 36.7682088, 
        "longitude": -76.2874927, 
        "population": "230571", 
        "rank": "91", 
        "state": "Virginia"
    }, 
    {
        "name": "Gilbert", 
        "growth_from_2000_to_2013": "96.0%", 
        "latitude": 33.3528264, 
        "longitude": -111.789027, 
        "population": "229972", 
        "rank": "92", 
        "state": "Arizona"
    }, 
    {
        "name": "Baton_Rouge", 
        "growth_from_2000_to_2013": "0.4%", 
        "latitude": 30.4582829, 
        "longitude": -91.1403196, 
        "population": "229426", 
        "rank": "93", 
        "state": "Louisiana"
    }, 
    {
        "name": "Irving", 
        "growth_from_2000_to_2013": "19.1%", 
        "latitude": 32.8140177, 
        "longitude": -96.9488945, 
        "population": "228653", 
        "rank": "94", 
        "state": "Texas"
    }, 
    {
        "name": "Scottsdale", 
        "growth_from_2000_to_2013": "11.0%", 
        "latitude": 33.4941704, 
        "longitude": -111.9260519, 
        "population": "226918", 
        "rank": "95", 
        "state": "Arizona"
    }, 
    {
        "name": "North Las Vegas", 
        "growth_from_2000_to_2013": "92.2%", 
        "latitude": 36.1988592, 
        "longitude": -115.1175013, 
        "population": "226877", 
        "rank": "96", 
        "state": "Nevada"
    }, 
    {
        "name": "Fremont", 
        "growth_from_2000_to_2013": "10.0%", 
        "latitude": 37.5482697, 
        "longitude": -121.9885719, 
        "population": "224922", 
        "rank": "97", 
        "state": "California"
    }, 
    {
        "name": "Boise_City", 
        "growth_from_2000_to_2013": "9.5%", 
        "latitude": 43.6187102, 
        "longitude": -116.2146068, 
        "population": "214237", 
        "rank": "98", 
        "state": "Idaho"
    }, 
    {
        "name": "Richmond", 
        "growth_from_2000_to_2013": "8.2%", 
        "latitude": 37.5407246, 
        "longitude": -77.4360481, 
        "population": "214114", 
        "rank": "99", 
        "state": "Virginia"
    }, 
    {
        "name": "San_Bernardino", 
        "growth_from_2000_to_2013": "13.0%", 
        "latitude": 34.1083449, 
        "longitude": -117.2897652, 
        "population": "213708", 
        "rank": "100", 
        "state": "California"
    }, 
    {
        "name": "Birmingham", 
        "growth_from_2000_to_2013": "-12.3%", 
        "latitude": 33.5206608, 
        "longitude": -86.80248999999999, 
        "population": "212113", 
        "rank": "101", 
        "state": "Alabama"
    }, 
    {
        "name": "Spokane", 
        "growth_from_2000_to_2013": "7.0%", 
        "latitude": 47.6587802, 
        "longitude": -117.4260466, 
        "population": "210721", 
        "rank": "102", 
        "state": "Washington"
    }, 
    {
        "name": "Rochester", 
        "growth_from_2000_to_2013": "-4.1%", 
        "latitude": 43.16103, 
        "longitude": -77.6109219, 
        "population": "210358", 
        "rank": "103", 
        "state": "New_York"
    }, 
    {
        "name": "Des_Moines", 
        "growth_from_2000_to_2013": "3.9%", 
        "latitude": 41.6005448, 
        "longitude": -93.6091064, 
        "population": "207510", 
        "rank": "104", 
        "state": "Iowa"
    }, 
    {
        "name": "Modesto", 
        "growth_from_2000_to_2013": "7.7%", 
        "latitude": 37.63909719999999, 
        "longitude": -120.9968782, 
        "population": "204933", 
        "rank": "105", 
        "state": "California"
    }, 
    {
        "name": "Fayetteville", 
        "growth_from_2000_to_2013": "2.4%", 
        "latitude": 35.0526641, 
        "longitude": -78.87835849999999, 
        "population": "204408", 
        "rank": "106", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Tacoma", 
        "growth_from_2000_to_2013": "4.9%", 
        "latitude": 47.2528768, 
        "longitude": -122.4442906, 
        "population": "203446", 
        "rank": "107", 
        "state": "Washington"
    }, 
    {
        "name": "Oxnard", 
        "growth_from_2000_to_2013": "18.2%", 
        "latitude": 34.1975048, 
        "longitude": -119.1770516, 
        "population": "203007", 
        "rank": "108", 
        "state": "California"
    }, 
    {
        "name": "Fontana", 
        "growth_from_2000_to_2013": "38.3%", 
        "latitude": 34.0922335, 
        "longitude": -117.435048, 
        "population": "203003", 
        "rank": "109", 
        "state": "California"
    }, 
    {
        "name": "Columbus", 
        "growth_from_2000_to_2013": "8.7%", 
        "latitude": 32.4609764, 
        "longitude": -84.9877094, 
        "population": "202824", 
        "rank": "110", 
        "state": "Georgia"
    }, 
    {
        "name": "Montgomery", 
        "growth_from_2000_to_2013": "-0.1%", 
        "latitude": 32.3668052, 
        "longitude": -86.2999689, 
        "population": "201332", 
        "rank": "111", 
        "state": "Alabama"
    }, 
    {
        "name": "Moreno_Valley", 
        "growth_from_2000_to_2013": "40.4%", 
        "latitude": 33.9424658, 
        "longitude": -117.2296717, 
        "population": "201175", 
        "rank": "112", 
        "state": "California"
    }, 
    {
        "name": "Shreveport", 
        "growth_from_2000_to_2013": "-0.1%", 
        "latitude": 32.5251516, 
        "longitude": -93.7501789, 
        "population": "200327", 
        "rank": "113", 
        "state": "Louisiana"
    }, 
    {
        "name": "Aurora", 
        "growth_from_2000_to_2013": "38.4%", 
        "latitude": 41.7605849, 
        "longitude": -88.32007150000001, 
        "population": "199963", 
        "rank": "114", 
        "state": "Illinois"
    }, 
    {
        "name": "Yonkers", 
        "growth_from_2000_to_2013": "1.8%", 
        "latitude": 40.9312099, 
        "longitude": -73.89874689999999, 
        "population": "199766", 
        "rank": "115", 
        "state": "New_York"
    }, 
    {
        "name": "Akron", 
        "growth_from_2000_to_2013": "-8.6%", 
        "latitude": 41.0814447, 
        "longitude": -81.51900529999999, 
        "population": "198100", 
        "rank": "116", 
        "state": "Ohio"
    }, 
    {
        "name": "Huntington_Beach", 
        "growth_from_2000_to_2013": "3.9%", 
        "latitude": 33.660297, 
        "longitude": -117.9992265, 
        "population": "197575", 
        "rank": "117", 
        "state": "California"
    }, 
    {
        "name": "Little_Rock", 
        "growth_from_2000_to_2013": "7.6%", 
        "latitude": 34.7464809, 
        "longitude": -92.28959479999999, 
        "population": "197357", 
        "rank": "118", 
        "state": "Arkansas"
    }, 
    {
        "name": "Augusta-Richmond County", 
        "growth_from_2000_to_2013": "1.1%", 
        "latitude": 33.4734978, 
        "longitude": -82.0105148, 
        "population": "197350", 
        "rank": "119", 
        "state": "Georgia"
    }, 
    {
        "name": "Amarillo", 
        "growth_from_2000_to_2013": "12.8%", 
        "latitude": 35.2219971, 
        "longitude": -101.8312969, 
        "population": "196429", 
        "rank": "120", 
        "state": "Texas"
    }, 
    {
        "name": "Glendale", 
        "growth_from_2000_to_2013": "0.3%", 
        "latitude": 34.1425078, 
        "longitude": -118.255075, 
        "population": "196021", 
        "rank": "121", 
        "state": "California"
    }, 
    {
        "name": "Mobile", 
        "growth_from_2000_to_2013": "-1.9%", 
        "latitude": 30.6953657, 
        "longitude": -88.0398912, 
        "population": "194899", 
        "rank": "122", 
        "state": "Alabama"
    }, 
    {
        "name": "Grand_Rapids", 
        "growth_from_2000_to_2013": "-2.8%", 
        "latitude": 42.9633599, 
        "longitude": -85.6680863, 
        "population": "192294", 
        "rank": "123", 
        "state": "Michigan"
    }, 
    {
        "name": "Salt Lake City", 
        "growth_from_2000_to_2013": "5.1%", 
        "latitude": 40.7607793, 
        "longitude": -111.8910474, 
        "population": "191180", 
        "rank": "124", 
        "state": "Utah"
    }, 
    {
        "name": "Tallahassee", 
        "growth_from_2000_to_2013": "21.8%", 
        "latitude": 30.4382559, 
        "longitude": -84.28073289999999, 
        "population": "186411", 
        "rank": "125", 
        "state": "Florida"
    }, 
    {
        "name": "Huntsville", 
        "growth_from_2000_to_2013": "16.3%", 
        "latitude": 34.7303688, 
        "longitude": -86.5861037, 
        "population": "186254", 
        "rank": "126", 
        "state": "Alabama"
    }, 
    {
        "name": "Grand_Prairie", 
        "growth_from_2000_to_2013": "43.1%", 
        "latitude": 32.7459645, 
        "longitude": -96.99778459999999, 
        "population": "183372", 
        "rank": "127", 
        "state": "Texas"
    }, 
    {
        "name": "Knoxville", 
        "growth_from_2000_to_2013": "3.9%", 
        "latitude": 35.9606384, 
        "longitude": -83.9207392, 
        "population": "183270", 
        "rank": "128", 
        "state": "Tennessee"
    }, 
    {
        "name": "Worcester", 
        "growth_from_2000_to_2013": "5.8%", 
        "latitude": 42.2625932, 
        "longitude": -71.8022934, 
        "population": "182544", 
        "rank": "129", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Newport_News", 
        "growth_from_2000_to_2013": "0.9%", 
        "latitude": 37.0870821, 
        "longitude": -76.4730122, 
        "population": "182020", 
        "rank": "130", 
        "state": "Virginia"
    }, 
    {
        "name": "Brownsville", 
        "growth_from_2000_to_2013": "26.8%", 
        "latitude": 25.9017472, 
        "longitude": -97.4974838, 
        "population": "181860", 
        "rank": "131", 
        "state": "Texas"
    }, 
    {
        "name": "Overland_Park", 
        "growth_from_2000_to_2013": "19.4%", 
        "latitude": 38.9822282, 
        "longitude": -94.6707917, 
        "population": "181260", 
        "rank": "132", 
        "state": "Kansas"
    }, 
    {
        "name": "Santa_Clarita", 
        "growth_from_2000_to_2013": "15.3%", 
        "latitude": 34.3916641, 
        "longitude": -118.542586, 
        "population": "179590", 
        "rank": "133", 
        "state": "California"
    }, 
    {
        "name": "Providence", 
        "growth_from_2000_to_2013": "2.3%", 
        "latitude": 41.8239891, 
        "longitude": -71.4128343, 
        "population": "177994", 
        "rank": "134", 
        "state": "Rhode_Island"
    }, 
    {
        "name": "Garden_Grove", 
        "growth_from_2000_to_2013": "5.8%", 
        "latitude": 33.7739053, 
        "longitude": -117.9414477, 
        "population": "175140", 
        "rank": "135", 
        "state": "California"
    }, 
    {
        "name": "Chattanooga", 
        "growth_from_2000_to_2013": "10.5%", 
        "latitude": 35.0456297, 
        "longitude": -85.3096801, 
        "population": "173366", 
        "rank": "136", 
        "state": "Tennessee"
    }, 
    {
        "name": "Oceanside", 
        "growth_from_2000_to_2013": "6.6%", 
        "latitude": 33.1958696, 
        "longitude": -117.3794834, 
        "population": "172794", 
        "rank": "137", 
        "state": "California"
    }, 
    {
        "name": "Jackson", 
        "growth_from_2000_to_2013": "-6.8%", 
        "latitude": 32.2987573, 
        "longitude": -90.1848103, 
        "population": "172638", 
        "rank": "138", 
        "state": "Mississippi"
    }, 
    {
        "name": "Fort_Lauderdale", 
        "growth_from_2000_to_2013": "0.7%", 
        "latitude": 26.1224386, 
        "longitude": -80.13731740000001, 
        "population": "172389", 
        "rank": "139", 
        "state": "Florida"
    }, 
    {
        "name": "Santa_Rosa", 
        "growth_from_2000_to_2013": "15.2%", 
        "latitude": 38.440429, 
        "longitude": -122.7140548, 
        "population": "171990", 
        "rank": "140", 
        "state": "California"
    }, 
    {
        "name": "Rancho_Cucamonga", 
        "growth_from_2000_to_2013": "32.7%", 
        "latitude": 34.10639889999999, 
        "longitude": -117.5931084, 
        "population": "171386", 
        "rank": "141", 
        "state": "California"
    }, 
    {
        "name": "Port St. Lucie", 
        "growth_from_2000_to_2013": "91.7%", 
        "latitude": 27.2730492, 
        "longitude": -80.3582261, 
        "population": "171016", 
        "rank": "142", 
        "state": "Florida"
    }, 
    {
        "name": "Tempe", 
        "growth_from_2000_to_2013": "5.8%", 
        "latitude": 33.4255104, 
        "longitude": -111.9400054, 
        "population": "168228", 
        "rank": "143", 
        "state": "Arizona"
    }, 
    {
        "name": "Ontario", 
        "growth_from_2000_to_2013": "5.5%", 
        "latitude": 34.0633443, 
        "longitude": -117.6508876, 
        "population": "167500", 
        "rank": "144", 
        "state": "California"
    }, 
    {
        "name": "Vancouver", 
        "growth_from_2000_to_2013": "14.2%", 
        "latitude": 45.6387281, 
        "longitude": -122.6614861, 
        "population": "167405", 
        "rank": "145", 
        "state": "Washington"
    }, 
    {
        "name": "Cape_Coral", 
        "growth_from_2000_to_2013": "60.4%", 
        "latitude": 26.5628537, 
        "longitude": -81.9495331, 
        "population": "165831", 
        "rank": "146", 
        "state": "Florida"
    }, 
    {
        "name": "Sioux_Falls", 
        "growth_from_2000_to_2013": "31.1%", 
        "latitude": 43.5445959, 
        "longitude": -96.73110340000001, 
        "population": "164676", 
        "rank": "147", 
        "state": "South_Dakota"
    }, 
    {
        "name": "Springfield", 
        "growth_from_2000_to_2013": "7.8%", 
        "latitude": 37.2089572, 
        "longitude": -93.29229889999999, 
        "population": "164122", 
        "rank": "148", 
        "state": "Missouri"
    }, 
    {
        "name": "Peoria", 
        "growth_from_2000_to_2013": "46.5%", 
        "latitude": 33.5805955, 
        "longitude": -112.2373779, 
        "population": "162592", 
        "rank": "149", 
        "state": "Arizona"
    }, 
    {
        "name": "Pembroke_Pines", 
        "growth_from_2000_to_2013": "17.4%", 
        "latitude": 26.007765, 
        "longitude": -80.2962555, 
        "population": "162329", 
        "rank": "150", 
        "state": "Florida"
    }, 
    {
        "name": "Elk_Grove", 
        "growth_from_2000_to_2013": "97.1%", 
        "latitude": 38.4087993, 
        "longitude": -121.3716178, 
        "population": "161007", 
        "rank": "151", 
        "state": "California"
    }, 
    {
        "name": "Salem", 
        "growth_from_2000_to_2013": "16.4%", 
        "latitude": 44.9428975, 
        "longitude": -123.0350963, 
        "population": "160614", 
        "rank": "152", 
        "state": "Oregon"
    }, 
    {
        "name": "Lancaster", 
        "growth_from_2000_to_2013": "33.8%", 
        "latitude": 34.6867846, 
        "longitude": -118.1541632, 
        "population": "159523", 
        "rank": "153", 
        "state": "California"
    }, 
    {
        "name": "Corona", 
        "growth_from_2000_to_2013": "23.6%", 
        "latitude": 33.8752935, 
        "longitude": -117.5664384, 
        "population": "159503", 
        "rank": "154", 
        "state": "California"
    }, 
    {
        "name": "Eugene", 
        "growth_from_2000_to_2013": "14.4%", 
        "latitude": 44.0520691, 
        "longitude": -123.0867536, 
        "population": "159190", 
        "rank": "155", 
        "state": "Oregon"
    }, 
    {
        "name": "Palmdale", 
        "growth_from_2000_to_2013": "33.7%", 
        "latitude": 34.5794343, 
        "longitude": -118.1164613, 
        "population": "157161", 
        "rank": "156", 
        "state": "California"
    }, 
    {
        "name": "Salinas", 
        "growth_from_2000_to_2013": "8.4%", 
        "latitude": 36.6777372, 
        "longitude": -121.6555013, 
        "population": "155662", 
        "rank": "157", 
        "state": "California"
    }, 
    {
        "name": "Springfield", 
        "growth_from_2000_to_2013": "1.1%", 
        "latitude": 42.1014831, 
        "longitude": -72.589811, 
        "population": "153703", 
        "rank": "158", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Pasadena", 
        "growth_from_2000_to_2013": "7.5%", 
        "latitude": 29.6910625, 
        "longitude": -95.2091006, 
        "population": "152735", 
        "rank": "159", 
        "state": "Texas"
    }, 
    {
        "name": "Fort_Collins", 
        "growth_from_2000_to_2013": "26.6%", 
        "latitude": 40.5852602, 
        "longitude": -105.084423, 
        "population": "152061", 
        "rank": "160", 
        "state": "Colorado"
    }, 
    {
        "name": "Hayward", 
        "growth_from_2000_to_2013": "7.5%", 
        "latitude": 37.6688205, 
        "longitude": -122.0807964, 
        "population": "151574", 
        "rank": "161", 
        "state": "California"
    }, 
    {
        "name": "Pomona", 
        "growth_from_2000_to_2013": "2.1%", 
        "latitude": 34.055103, 
        "longitude": -117.7499909, 
        "population": "151348", 
        "rank": "162", 
        "state": "California"
    }, 
    {
        "name": "Cary", 
        "growth_from_2000_to_2013": "55.1%", 
        "latitude": 35.79154, 
        "longitude": -78.7811169, 
        "population": "151088", 
        "rank": "163", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Rockford", 
        "growth_from_2000_to_2013": "-1.0%", 
        "latitude": 42.2711311, 
        "longitude": -89.0939952, 
        "population": "150251", 
        "rank": "164", 
        "state": "Illinois"
    }, 
    {
        "name": "Alexandria", 
        "growth_from_2000_to_2013": "15.0%", 
        "latitude": 38.8048355, 
        "longitude": -77.0469214, 
        "population": "148892", 
        "rank": "165", 
        "state": "Virginia"
    }, 
    {
        "name": "Escondido", 
        "growth_from_2000_to_2013": "10.7%", 
        "latitude": 33.1192068, 
        "longitude": -117.086421, 
        "population": "148738", 
        "rank": "166", 
        "state": "California"
    }, 
    {
        "name": "McKinney", 
        "growth_from_2000_to_2013": "165.3%", 
        "latitude": 33.1972465, 
        "longitude": -96.6397822, 
        "population": "148559", 
        "rank": "167", 
        "state": "Texas"
    }, 
    {
        "name": "Kansas_City", 
        "growth_from_2000_to_2013": "1.1%", 
        "latitude": 39.114053, 
        "longitude": -94.6274636, 
        "population": "148483", 
        "rank": "168", 
        "state": "Kansas"
    }, 
    {
        "name": "Joliet", 
        "growth_from_2000_to_2013": "36.5%", 
        "latitude": 41.525031, 
        "longitude": -88.0817251, 
        "population": "147806", 
        "rank": "169", 
        "state": "Illinois"
    }, 
    {
        "name": "Sunnyvale", 
        "growth_from_2000_to_2013": "11.9%", 
        "latitude": 37.36883, 
        "longitude": -122.0363496, 
        "population": "147559", 
        "rank": "170", 
        "state": "California"
    }, 
    {
        "name": "Torrance", 
        "growth_from_2000_to_2013": "6.6%", 
        "latitude": 33.8358492, 
        "longitude": -118.3406288, 
        "population": "147478", 
        "rank": "171", 
        "state": "California"
    }, 
    {
        "name": "Bridgeport", 
        "growth_from_2000_to_2013": "5.4%", 
        "latitude": 41.1865478, 
        "longitude": -73.19517669999999, 
        "population": "147216", 
        "rank": "172", 
        "state": "Connecticut"
    }, 
    {
        "name": "Lakewood", 
        "growth_from_2000_to_2013": "1.9%", 
        "latitude": 39.7047095, 
        "longitude": -105.0813734, 
        "population": "147214", 
        "rank": "173", 
        "state": "Colorado"
    }, 
    {
        "name": "Hollywood", 
        "growth_from_2000_to_2013": "4.8%", 
        "latitude": 26.0112014, 
        "longitude": -80.1494901, 
        "population": "146526", 
        "rank": "174", 
        "state": "Florida"
    }, 
    {
        "name": "Paterson", 
        "growth_from_2000_to_2013": "-2.2%", 
        "latitude": 40.9167654, 
        "longitude": -74.17181099999999, 
        "population": "145948", 
        "rank": "175", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Naperville", 
        "growth_from_2000_to_2013": "12.0%", 
        "latitude": 41.7508391, 
        "longitude": -88.1535352, 
        "population": "144864", 
        "rank": "176", 
        "state": "Illinois"
    }, 
    {
        "name": "Syracuse", 
        "growth_from_2000_to_2013": "-0.9%", 
        "latitude": 43.0481221, 
        "longitude": -76.14742439999999, 
        "population": "144669", 
        "rank": "177", 
        "state": "New_York"
    }, 
    {
        "name": "Mesquite", 
        "growth_from_2000_to_2013": "14.7%", 
        "latitude": 32.76679550000001, 
        "longitude": -96.5991593, 
        "population": "143484", 
        "rank": "178", 
        "state": "Texas"
    }, 
    {
        "name": "Dayton", 
        "growth_from_2000_to_2013": "-13.5%", 
        "latitude": 39.7589478, 
        "longitude": -84.1916069, 
        "population": "143355", 
        "rank": "179", 
        "state": "Ohio"
    }, 
    {
        "name": "Savannah", 
        "growth_from_2000_to_2013": "7.5%", 
        "latitude": 32.0835407, 
        "longitude": -81.09983419999999, 
        "population": "142772", 
        "rank": "180", 
        "state": "Georgia"
    }, 
    {
        "name": "Clarksville", 
        "growth_from_2000_to_2013": "36.9%", 
        "latitude": 36.5297706, 
        "longitude": -87.3594528, 
        "population": "142357", 
        "rank": "181", 
        "state": "Tennessee"
    }, 
    {
        "name": "Orange", 
        "growth_from_2000_to_2013": "7.7%", 
        "latitude": 33.7877944, 
        "longitude": -117.8531119, 
        "population": "139969", 
        "rank": "182", 
        "state": "California"
    }, 
    {
        "name": "Pasadena", 
        "growth_from_2000_to_2013": "3.8%", 
        "latitude": 34.1477849, 
        "longitude": -118.1445155, 
        "population": "139731", 
        "rank": "183", 
        "state": "California"
    }, 
    {
        "name": "Fullerton", 
        "growth_from_2000_to_2013": "9.8%", 
        "latitude": 33.8703596, 
        "longitude": -117.9242966, 
        "population": "138981", 
        "rank": "184", 
        "state": "California"
    }, 
    {
        "name": "Killeen", 
        "growth_from_2000_to_2013": "52.1%", 
        "latitude": 31.1171194, 
        "longitude": -97.72779589999999, 
        "population": "137147", 
        "rank": "185", 
        "state": "Texas"
    }, 
    {
        "name": "Frisco", 
        "growth_from_2000_to_2013": "287.7%", 
        "latitude": 33.1506744, 
        "longitude": -96.82361159999999, 
        "population": "136791", 
        "rank": "186", 
        "state": "Texas"
    }, 
    {
        "name": "Hampton", 
        "growth_from_2000_to_2013": "-6.6%", 
        "latitude": 37.0298687, 
        "longitude": -76.34522179999999, 
        "population": "136699", 
        "rank": "187", 
        "state": "Virginia"
    }, 
    {
        "name": "McAllen", 
        "growth_from_2000_to_2013": "27.6%", 
        "latitude": 26.2034071, 
        "longitude": -98.23001239999999, 
        "population": "136639", 
        "rank": "188", 
        "state": "Texas"
    }, 
    {
        "name": "Warren", 
        "growth_from_2000_to_2013": "-2.3%", 
        "latitude": 42.5144566, 
        "longitude": -83.01465259999999, 
        "population": "134873", 
        "rank": "189", 
        "state": "Michigan"
    }, 
    {
        "name": "Bellevue", 
        "growth_from_2000_to_2013": "19.1%", 
        "latitude": 47.610377, 
        "longitude": -122.2006786, 
        "population": "133992", 
        "rank": "190", 
        "state": "Washington"
    }, 
    {
        "name": "West Valley City", 
        "growth_from_2000_to_2013": "22.2%", 
        "latitude": 40.6916132, 
        "longitude": -112.0010501, 
        "population": "133579", 
        "rank": "191", 
        "state": "Utah"
    }, 
    {
        "name": "Columbia", 
        "growth_from_2000_to_2013": "11.7%", 
        "latitude": 34.0007104, 
        "longitude": -81.0348144, 
        "population": "133358", 
        "rank": "192", 
        "state": "South_Carolina"
    }, 
    {
        "name": "Olathe", 
        "growth_from_2000_to_2013": "40.4%", 
        "latitude": 38.8813958, 
        "longitude": -94.81912849999999, 
        "population": "131885", 
        "rank": "193", 
        "state": "Kansas"
    }, 
    {
        "name": "Sterling_Heights", 
        "growth_from_2000_to_2013": "5.2%", 
        "latitude": 42.5803122, 
        "longitude": -83.0302033, 
        "population": "131224", 
        "rank": "194", 
        "state": "Michigan"
    }, 
    {
        "name": "New_Haven", 
        "growth_from_2000_to_2013": "5.5%", 
        "latitude": 41.308274, 
        "longitude": -72.9278835, 
        "population": "130660", 
        "rank": "195", 
        "state": "Connecticut"
    }, 
    {
        "name": "Miramar", 
        "growth_from_2000_to_2013": "74.7%", 
        "latitude": 25.9860762, 
        "longitude": -80.30356019999999, 
        "population": "130288", 
        "rank": "196", 
        "state": "Florida"
    }, 
    {
        "name": "Waco", 
        "growth_from_2000_to_2013": "12.5%", 
        "latitude": 31.549333, 
        "longitude": -97.1466695, 
        "population": "129030", 
        "rank": "197", 
        "state": "Texas"
    }, 
    {
        "name": "Thousand_Oaks", 
        "growth_from_2000_to_2013": "9.5%", 
        "latitude": 34.1705609, 
        "longitude": -118.8375937, 
        "population": "128731", 
        "rank": "198", 
        "state": "California"
    }, 
    {
        "name": "Cedar_Rapids", 
        "growth_from_2000_to_2013": "5.4%", 
        "latitude": 41.9778795, 
        "longitude": -91.6656232, 
        "population": "128429", 
        "rank": "199", 
        "state": "Iowa"
    }, 
    {
        "name": "Charleston", 
        "growth_from_2000_to_2013": "29.2%", 
        "latitude": 32.7764749, 
        "longitude": -79.93105120000001, 
        "population": "127999", 
        "rank": "200", 
        "state": "South_Carolina"
    }, 
    {
        "name": "Visalia", 
        "growth_from_2000_to_2013": "33.6%", 
        "latitude": 36.3302284, 
        "longitude": -119.2920585, 
        "population": "127763", 
        "rank": "201", 
        "state": "California"
    }, 
    {
        "name": "Topeka", 
        "growth_from_2000_to_2013": "3.4%", 
        "latitude": 39.0558235, 
        "longitude": -95.68901849999999, 
        "population": "127679", 
        "rank": "202", 
        "state": "Kansas"
    }, 
    {
        "name": "Elizabeth", 
        "growth_from_2000_to_2013": "5.5%", 
        "latitude": 40.6639916, 
        "longitude": -74.2107006, 
        "population": "127558", 
        "rank": "203", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Gainesville", 
        "growth_from_2000_to_2013": "12.8%", 
        "latitude": 29.6516344, 
        "longitude": -82.32482619999999, 
        "population": "127488", 
        "rank": "204", 
        "state": "Florida"
    }, 
    {
        "name": "Thornton", 
        "growth_from_2000_to_2013": "52.9%", 
        "latitude": 39.8680412, 
        "longitude": -104.9719243, 
        "population": "127359", 
        "rank": "205", 
        "state": "Colorado"
    }, 
    {
        "name": "Roseville", 
        "growth_from_2000_to_2013": "56.2%", 
        "latitude": 38.7521235, 
        "longitude": -121.2880059, 
        "population": "127035", 
        "rank": "206", 
        "state": "California"
    }, 
    {
        "name": "Carrollton", 
        "growth_from_2000_to_2013": "14.9%", 
        "latitude": 32.9756415, 
        "longitude": -96.8899636, 
        "population": "126700", 
        "rank": "207", 
        "state": "Texas"
    }, 
    {
        "name": "Coral_Springs", 
        "growth_from_2000_to_2013": "5.7%", 
        "latitude": 26.271192, 
        "longitude": -80.2706044, 
        "population": "126604", 
        "rank": "208", 
        "state": "Florida"
    }, 
    {
        "name": "Stamford", 
        "growth_from_2000_to_2013": "7.6%", 
        "latitude": 41.0534302, 
        "longitude": -73.5387341, 
        "population": "126456", 
        "rank": "209", 
        "state": "Connecticut"
    }, 
    {
        "name": "Simi_Valley", 
        "growth_from_2000_to_2013": "12.6%", 
        "latitude": 34.2694474, 
        "longitude": -118.781482, 
        "population": "126181", 
        "rank": "210", 
        "state": "California"
    }, 
    {
        "name": "Concord", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 37.9779776, 
        "longitude": -122.0310733, 
        "population": "125880", 
        "rank": "211", 
        "state": "California"
    }, 
    {
        "name": "Hartford", 
        "growth_from_2000_to_2013": "0.6%", 
        "latitude": 41.76371109999999, 
        "longitude": -72.6850932, 
        "population": "125017", 
        "rank": "212", 
        "state": "Connecticut"
    }, 
    {
        "name": "Kent", 
        "growth_from_2000_to_2013": "54.3%", 
        "latitude": 47.3809335, 
        "longitude": -122.2348431, 
        "population": "124435", 
        "rank": "213", 
        "state": "Washington"
    }, 
    {
        "name": "Lafayette", 
        "growth_from_2000_to_2013": "11.0%", 
        "latitude": 30.2240897, 
        "longitude": -92.0198427, 
        "population": "124276", 
        "rank": "214", 
        "state": "Louisiana"
    }, 
    {
        "name": "Midland", 
        "growth_from_2000_to_2013": "30.4%", 
        "latitude": 31.9973456, 
        "longitude": -102.0779146, 
        "population": "123933", 
        "rank": "215", 
        "state": "Texas"
    }, 
    {
        "name": "Surprise", 
        "growth_from_2000_to_2013": "281.9%", 
        "latitude": 33.6292337, 
        "longitude": -112.3679279, 
        "population": "123546", 
        "rank": "216", 
        "state": "Arizona"
    }, 
    {
        "name": "Denton", 
        "growth_from_2000_to_2013": "47.1%", 
        "latitude": 33.2148412, 
        "longitude": -97.13306829999999, 
        "population": "123099", 
        "rank": "217", 
        "state": "Texas"
    }, 
    {
        "name": "Victorville", 
        "growth_from_2000_to_2013": "87.6%", 
        "latitude": 34.5362184, 
        "longitude": -117.2927641, 
        "population": "121096", 
        "rank": "218", 
        "state": "California"
    }, 
    {
        "name": "Evansville", 
        "growth_from_2000_to_2013": "-0.8%", 
        "latitude": 37.9715592, 
        "longitude": -87.5710898, 
        "population": "120310", 
        "rank": "219", 
        "state": "Indiana"
    }, 
    {
        "name": "Santa_Clara", 
        "growth_from_2000_to_2013": "17.4%", 
        "latitude": 37.3541079, 
        "longitude": -121.9552356, 
        "population": "120245", 
        "rank": "220", 
        "state": "California"
    }, 
    {
        "name": "Abilene", 
        "growth_from_2000_to_2013": "3.6%", 
        "latitude": 32.4487364, 
        "longitude": -99.73314390000002, 
        "population": "120099", 
        "rank": "221", 
        "state": "Texas"
    }, 
    {
        "name": "Athens-Clarke County", 
        "growth_from_2000_to_2013": "19.0%", 
        "latitude": 33.9519347, 
        "longitude": -83.357567, 
        "population": "119980", 
        "rank": "222", 
        "state": "Georgia"
    }, 
    {
        "name": "Vallejo", 
        "growth_from_2000_to_2013": "1.2%", 
        "latitude": 38.1040864, 
        "longitude": -122.2566367, 
        "population": "118837", 
        "rank": "223", 
        "state": "California"
    }, 
    {
        "name": "Allentown", 
        "growth_from_2000_to_2013": "11.2%", 
        "latitude": 40.6084305, 
        "longitude": -75.4901833, 
        "population": "118577", 
        "rank": "224", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Norman", 
        "growth_from_2000_to_2013": "22.0%", 
        "latitude": 35.2225668, 
        "longitude": -97.4394777, 
        "population": "118197", 
        "rank": "225", 
        "state": "Oklahoma"
    }, 
    {
        "name": "Beaumont", 
        "growth_from_2000_to_2013": "3.7%", 
        "latitude": 30.080174, 
        "longitude": -94.1265562, 
        "population": "117796", 
        "rank": "226", 
        "state": "Texas"
    }, 
    {
        "name": "Independence", 
        "growth_from_2000_to_2013": "3.2%", 
        "latitude": 39.0911161, 
        "longitude": -94.41550679999999, 
        "population": "117240", 
        "rank": "227", 
        "state": "Missouri"
    }, 
    {
        "name": "Murfreesboro", 
        "growth_from_2000_to_2013": "65.1%", 
        "latitude": 35.8456213, 
        "longitude": -86.39027, 
        "population": "117044", 
        "rank": "228", 
        "state": "Tennessee"
    }, 
    {
        "name": "Ann_Arbor", 
        "growth_from_2000_to_2013": "2.0%", 
        "latitude": 42.2808256, 
        "longitude": -83.7430378, 
        "population": "117025", 
        "rank": "229", 
        "state": "Michigan"
    }, 
    {
        "name": "Springfield", 
        "growth_from_2000_to_2013": "4.2%", 
        "latitude": 39.78172130000001, 
        "longitude": -89.6501481, 
        "population": "117006", 
        "rank": "230", 
        "state": "Illinois"
    }, 
    {
        "name": "Berkeley", 
        "growth_from_2000_to_2013": "13.3%", 
        "latitude": 37.8715926, 
        "longitude": -122.272747, 
        "population": "116768", 
        "rank": "231", 
        "state": "California"
    }, 
    {
        "name": "Peoria", 
        "growth_from_2000_to_2013": "3.0%", 
        "latitude": 40.6936488, 
        "longitude": -89.5889864, 
        "population": "116513", 
        "rank": "232", 
        "state": "Illinois"
    }, 
    {
        "name": "Provo", 
        "growth_from_2000_to_2013": "10.0%", 
        "latitude": 40.2338438, 
        "longitude": -111.6585337, 
        "population": "116288", 
        "rank": "233", 
        "state": "Utah"
    }, 
    {
        "name": "El_Monte", 
        "growth_from_2000_to_2013": "-0.4%", 
        "latitude": 34.0686206, 
        "longitude": -118.0275667, 
        "population": "115708", 
        "rank": "234", 
        "state": "California"
    }, 
    {
        "name": "Columbia", 
        "growth_from_2000_to_2013": "34.0%", 
        "latitude": 38.9517053, 
        "longitude": -92.3340724, 
        "population": "115276", 
        "rank": "235", 
        "state": "Missouri"
    }, 
    {
        "name": "Lansing", 
        "growth_from_2000_to_2013": "-4.4%", 
        "latitude": 42.732535, 
        "longitude": -84.5555347, 
        "population": "113972", 
        "rank": "236", 
        "state": "Michigan"
    }, 
    {
        "name": "Fargo", 
        "growth_from_2000_to_2013": "24.9%", 
        "latitude": 46.8771863, 
        "longitude": -96.7898034, 
        "population": "113658", 
        "rank": "237", 
        "state": "North_Dakota"
    }, 
    {
        "name": "Downey", 
        "growth_from_2000_to_2013": "5.3%", 
        "latitude": 33.9401088, 
        "longitude": -118.1331593, 
        "population": "113242", 
        "rank": "238", 
        "state": "California"
    }, 
    {
        "name": "Costa_Mesa", 
        "growth_from_2000_to_2013": "2.4%", 
        "latitude": 33.6411316, 
        "longitude": -117.9186689, 
        "population": "112174", 
        "rank": "239", 
        "state": "California"
    }, 
    {
        "name": "Wilmington", 
        "growth_from_2000_to_2013": "24.8%", 
        "latitude": 34.2257255, 
        "longitude": -77.9447102, 
        "population": "112067", 
        "rank": "240", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Arvada", 
        "growth_from_2000_to_2013": "9.2%", 
        "latitude": 39.8027644, 
        "longitude": -105.0874842, 
        "population": "111707", 
        "rank": "241", 
        "state": "Colorado"
    }, 
    {
        "name": "Inglewood", 
        "growth_from_2000_to_2013": "-1.0%", 
        "latitude": 33.9616801, 
        "longitude": -118.3531311, 
        "population": "111542", 
        "rank": "242", 
        "state": "California"
    }, 
    {
        "name": "Miami_Gardens", 
        "growth_from_2000_to_2013": "10.5%", 
        "latitude": 25.9420377, 
        "longitude": -80.2456045, 
        "population": "111378", 
        "rank": "243", 
        "state": "Florida"
    }, 
    {
        "name": "Carlsbad", 
        "growth_from_2000_to_2013": "39.7%", 
        "latitude": 33.1580933, 
        "longitude": -117.3505939, 
        "population": "110972", 
        "rank": "244", 
        "state": "California"
    }, 
    {
        "name": "Westminster", 
        "growth_from_2000_to_2013": "9.4%", 
        "latitude": 39.8366528, 
        "longitude": -105.0372046, 
        "population": "110945", 
        "rank": "245", 
        "state": "Colorado"
    }, 
    {
        "name": "Rochester", 
        "growth_from_2000_to_2013": "23.9%", 
        "latitude": 44.0121221, 
        "longitude": -92.4801989, 
        "population": "110742", 
        "rank": "246", 
        "state": "Minnesota"
    }, 
    {
        "name": "Odessa", 
        "growth_from_2000_to_2013": "22.3%", 
        "latitude": 31.8456816, 
        "longitude": -102.3676431, 
        "population": "110720", 
        "rank": "247", 
        "state": "Texas"
    }, 
    {
        "name": "Manchester", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 42.9956397, 
        "longitude": -71.4547891, 
        "population": "110378", 
        "rank": "248", 
        "state": "New_Hampshire"
    }, 
    {
        "name": "Elgin", 
        "growth_from_2000_to_2013": "16.0%", 
        "latitude": 42.0354084, 
        "longitude": -88.2825668, 
        "population": "110145", 
        "rank": "249", 
        "state": "Illinois"
    }, 
    {
        "name": "West_Jordan", 
        "growth_from_2000_to_2013": "38.4%", 
        "latitude": 40.6096698, 
        "longitude": -111.9391031, 
        "population": "110077", 
        "rank": "250", 
        "state": "Utah"
    }, 
    {
        "name": "Round_Rock", 
        "growth_from_2000_to_2013": "81.0%", 
        "latitude": 30.5082551, 
        "longitude": -97.678896, 
        "population": "109821", 
        "rank": "251", 
        "state": "Texas"
    }, 
    {
        "name": "Clearwater", 
        "growth_from_2000_to_2013": "0.1%", 
        "latitude": 27.9658533, 
        "longitude": -82.8001026, 
        "population": "109703", 
        "rank": "252", 
        "state": "Florida"
    }, 
    {
        "name": "Waterbury", 
        "growth_from_2000_to_2013": "2.2%", 
        "latitude": 41.5581525, 
        "longitude": -73.0514965, 
        "population": "109676", 
        "rank": "253", 
        "state": "Connecticut"
    }, 
    {
        "name": "Gresham", 
        "growth_from_2000_to_2013": "20.7%", 
        "latitude": 45.5001357, 
        "longitude": -122.4302013, 
        "population": "109397", 
        "rank": "254", 
        "state": "Oregon"
    }, 
    {
        "name": "Fairfield", 
        "growth_from_2000_to_2013": "12.8%", 
        "latitude": 38.24935809999999, 
        "longitude": -122.0399663, 
        "population": "109320", 
        "rank": "255", 
        "state": "California"
    }, 
    {
        "name": "Billings", 
        "growth_from_2000_to_2013": "18.6%", 
        "latitude": 45.7832856, 
        "longitude": -108.5006904, 
        "population": "109059", 
        "rank": "256", 
        "state": "Montana"
    }, 
    {
        "name": "Lowell", 
        "growth_from_2000_to_2013": "3.4%", 
        "latitude": 42.6334247, 
        "longitude": -71.31617179999999, 
        "population": "108861", 
        "rank": "257", 
        "state": "Massachusetts"
    }, 
    {
        "name": "San Buenaventura (Ventura)", 
        "growth_from_2000_to_2013": "7.4%", 
        "latitude": 34.274646, 
        "longitude": -119.2290316, 
        "population": "108817", 
        "rank": "258", 
        "state": "California"
    }, 
    {
        "name": "Pueblo", 
        "growth_from_2000_to_2013": "5.9%", 
        "latitude": 38.2544472, 
        "longitude": -104.6091409, 
        "population": "108249", 
        "rank": "259", 
        "state": "Colorado"
    }, 
    {
        "name": "High_Point", 
        "growth_from_2000_to_2013": "24.3%", 
        "latitude": 35.9556923, 
        "longitude": -80.0053176, 
        "population": "107741", 
        "rank": "260", 
        "state": "North_Carolina"
    }, 
    {
        "name": "West_Covina", 
        "growth_from_2000_to_2013": "2.3%", 
        "latitude": 34.0686208, 
        "longitude": -117.9389526, 
        "population": "107740", 
        "rank": "261", 
        "state": "California"
    }, 
    {
        "name": "Richmond", 
        "growth_from_2000_to_2013": "7.9%", 
        "latitude": 37.9357576, 
        "longitude": -122.3477486, 
        "population": "107571", 
        "rank": "262", 
        "state": "California"
    }, 
    {
        "name": "Murrieta", 
        "growth_from_2000_to_2013": "107.4%", 
        "latitude": 33.5539143, 
        "longitude": -117.2139232, 
        "population": "107479", 
        "rank": "263", 
        "state": "California"
    }, 
    {
        "name": "Cambridge", 
        "growth_from_2000_to_2013": "5.5%", 
        "latitude": 42.3736158, 
        "longitude": -71.10973349999999, 
        "population": "107289", 
        "rank": "264", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Antioch", 
        "growth_from_2000_to_2013": "16.9%", 
        "latitude": 38.0049214, 
        "longitude": -121.805789, 
        "population": "107100", 
        "rank": "265", 
        "state": "California"
    }, 
    {
        "name": "Temecula", 
        "growth_from_2000_to_2013": "55.4%", 
        "latitude": 33.4936391, 
        "longitude": -117.1483648, 
        "population": "106780", 
        "rank": "266", 
        "state": "California"
    }, 
    {
        "name": "Norwalk", 
        "growth_from_2000_to_2013": "1.9%", 
        "latitude": 33.9022367, 
        "longitude": -118.081733, 
        "population": "106589", 
        "rank": "267", 
        "state": "California"
    }, 
    {
        "name": "Centennial", 
        "growth_from_2000_to_2013": "3.5%", 
        "latitude": 39.5807452, 
        "longitude": -104.8771726, 
        "population": "106114", 
        "rank": "268", 
        "state": "Colorado"
    }, 
    {
        "name": "Everett", 
        "growth_from_2000_to_2013": "9.4%", 
        "latitude": 47.9789848, 
        "longitude": -122.2020794, 
        "population": "105370", 
        "rank": "269", 
        "state": "Washington"
    }, 
    {
        "name": "Palm_Bay", 
        "growth_from_2000_to_2013": "31.7%", 
        "latitude": 28.0344621, 
        "longitude": -80.5886646, 
        "population": "104898", 
        "rank": "270", 
        "state": "Florida"
    }, 
    {
        "name": "Wichita_Falls", 
        "growth_from_2000_to_2013": "0.7%", 
        "latitude": 33.9137085, 
        "longitude": -98.4933873, 
        "population": "104898", 
        "rank": "271", 
        "state": "Texas"
    }, 
    {
        "name": "Green_Bay", 
        "growth_from_2000_to_2013": "1.9%", 
        "latitude": 44.51915899999999, 
        "longitude": -88.019826, 
        "population": "104779", 
        "rank": "272", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Daly_City", 
        "growth_from_2000_to_2013": "1.0%", 
        "latitude": 37.6879241, 
        "longitude": -122.4702079, 
        "population": "104739", 
        "rank": "273", 
        "state": "California"
    }, 
    {
        "name": "Burbank", 
        "growth_from_2000_to_2013": "4.2%", 
        "latitude": 34.1808392, 
        "longitude": -118.3089661, 
        "population": "104709", 
        "rank": "274", 
        "state": "California"
    }, 
    {
        "name": "Richardson", 
        "growth_from_2000_to_2013": "13.2%", 
        "latitude": 32.9483335, 
        "longitude": -96.7298519, 
        "population": "104475", 
        "rank": "275", 
        "state": "Texas"
    }, 
    {
        "name": "Pompano_Beach", 
        "growth_from_2000_to_2013": "4.0%", 
        "latitude": 26.2378597, 
        "longitude": -80.1247667, 
        "population": "104410", 
        "rank": "276", 
        "state": "Florida"
    }, 
    {
        "name": "North_Charleston", 
        "growth_from_2000_to_2013": "27.4%", 
        "latitude": 32.8546197, 
        "longitude": -79.9748103, 
        "population": "104054", 
        "rank": "277", 
        "state": "South_Carolina"
    }, 
    {
        "name": "Broken_Arrow", 
        "growth_from_2000_to_2013": "28.2%", 
        "latitude": 36.060949, 
        "longitude": -95.7974526, 
        "population": "103500", 
        "rank": "278", 
        "state": "Oklahoma"
    }, 
    {
        "name": "Boulder", 
        "growth_from_2000_to_2013": "9.0%", 
        "latitude": 40.0149856, 
        "longitude": -105.2705456, 
        "population": "103166", 
        "rank": "279", 
        "state": "Colorado"
    }, 
    {
        "name": "West Palm Beach", 
        "growth_from_2000_to_2013": "23.5%", 
        "latitude": 26.7153424, 
        "longitude": -80.0533746, 
        "population": "102436", 
        "rank": "280", 
        "state": "Florida"
    }, 
    {
        "name": "Santa_Maria", 
        "growth_from_2000_to_2013": "30.9%", 
        "latitude": 34.9530337, 
        "longitude": -120.4357191, 
        "population": "102216", 
        "rank": "281", 
        "state": "California"
    }, 
    {
        "name": "El_Cajon", 
        "growth_from_2000_to_2013": "7.4%", 
        "latitude": 32.7947731, 
        "longitude": -116.9625269, 
        "population": "102211", 
        "rank": "282", 
        "state": "California"
    }, 
    {
        "name": "Davenport", 
        "growth_from_2000_to_2013": "3.9%", 
        "latitude": 41.5236437, 
        "longitude": -90.5776367, 
        "population": "102157", 
        "rank": "283", 
        "state": "Iowa"
    }, 
    {
        "name": "Rialto", 
        "growth_from_2000_to_2013": "9.8%", 
        "latitude": 34.1064001, 
        "longitude": -117.3703235, 
        "population": "101910", 
        "rank": "284", 
        "state": "California"
    }, 
    {
        "name": "Las_Cruces", 
        "growth_from_2000_to_2013": "37.6%", 
        "latitude": 32.3199396, 
        "longitude": -106.7636538, 
        "population": "101324", 
        "rank": "285", 
        "state": "New_Mexico"
    }, 
    {
        "name": "San_Mateo", 
        "growth_from_2000_to_2013": "9.0%", 
        "latitude": 37.5629917, 
        "longitude": -122.3255254, 
        "population": "101128", 
        "rank": "286", 
        "state": "California"
    }, 
    {
        "name": "Lewisville", 
        "growth_from_2000_to_2013": "28.9%", 
        "latitude": 33.046233, 
        "longitude": -96.994174, 
        "population": "101074", 
        "rank": "287", 
        "state": "Texas"
    }, 
    {
        "name": "South_Bend", 
        "growth_from_2000_to_2013": "-6.8%", 
        "latitude": 41.6763545, 
        "longitude": -86.25198979999999, 
        "population": "100886", 
        "rank": "288", 
        "state": "Indiana"
    }, 
    {
        "name": "Lakeland", 
        "growth_from_2000_to_2013": "18.3%", 
        "latitude": 28.0394654, 
        "longitude": -81.9498042, 
        "population": "100710", 
        "rank": "289", 
        "state": "Florida"
    }, 
    {
        "name": "Erie", 
        "growth_from_2000_to_2013": "-2.8%", 
        "latitude": 42.12922409999999, 
        "longitude": -80.085059, 
        "population": "100671", 
        "rank": "290", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Tyler", 
        "growth_from_2000_to_2013": "18.6%", 
        "latitude": 32.3512601, 
        "longitude": -95.30106239999999, 
        "population": "100223", 
        "rank": "291", 
        "state": "Texas"
    }, 
    {
        "name": "Pearland", 
        "growth_from_2000_to_2013": "117.2%", 
        "latitude": 29.5635666, 
        "longitude": -95.2860474, 
        "population": "100065", 
        "rank": "292", 
        "state": "Texas"
    }, 
    {
        "name": "College_Station", 
        "growth_from_2000_to_2013": "45.2%", 
        "latitude": 30.627977, 
        "longitude": -96.3344068, 
        "population": "100050", 
        "rank": "293", 
        "state": "Texas"
    }, 
    {
        "name": "Kenosha", 
        "growth_from_2000_to_2013": "9.5%", 
        "latitude": 42.5847425, 
        "longitude": -87.82118539999999, 
        "population": "99889", 
        "rank": "294", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Sandy_Springs", 
        "growth_from_2000_to_2013": "17.4%", 
        "latitude": 33.9304352, 
        "longitude": -84.3733147, 
        "population": "99770", 
        "rank": "295", 
        "state": "Georgia"
    }, 
    {
        "name": "Clovis", 
        "growth_from_2000_to_2013": "42.6%", 
        "latitude": 36.8252277, 
        "longitude": -119.7029194, 
        "population": "99769", 
        "rank": "296", 
        "state": "California"
    }, 
    {
        "name": "Flint", 
        "growth_from_2000_to_2013": "-20.0%", 
        "latitude": 43.0125274, 
        "longitude": -83.6874562, 
        "population": "99763", 
        "rank": "297", 
        "state": "Michigan"
    }, 
    {
        "name": "Roanoke", 
        "growth_from_2000_to_2013": "3.8%", 
        "latitude": 37.2709704, 
        "longitude": -79.9414266, 
        "population": "98465", 
        "rank": "298", 
        "state": "Virginia"
    }, 
    {
        "name": "Albany", 
        "growth_from_2000_to_2013": "4.1%", 
        "latitude": 42.6525793, 
        "longitude": -73.7562317, 
        "population": "98424", 
        "rank": "299", 
        "state": "New_York"
    }, 
    {
        "name": "Jurupa_Valley", 
        "growth_from_2000_to_2013": "", 
        "latitude": 33.9971974, 
        "longitude": -117.4854802, 
        "population": "98030", 
        "rank": "300", 
        "state": "California"
    }, 
    {
        "name": "Compton", 
        "growth_from_2000_to_2013": "4.5%", 
        "latitude": 33.8958492, 
        "longitude": -118.2200712, 
        "population": "97877", 
        "rank": "301", 
        "state": "California"
    }, 
    {
        "name": "San_Angelo", 
        "growth_from_2000_to_2013": "10.2%", 
        "latitude": 31.4637723, 
        "longitude": -100.4370375, 
        "population": "97492", 
        "rank": "302", 
        "state": "Texas"
    }, 
    {
        "name": "Hillsboro", 
        "growth_from_2000_to_2013": "36.4%", 
        "latitude": 45.5228939, 
        "longitude": -122.989827, 
        "population": "97368", 
        "rank": "303", 
        "state": "Oregon"
    }, 
    {
        "name": "Lawton", 
        "growth_from_2000_to_2013": "4.9%", 
        "latitude": 34.6035669, 
        "longitude": -98.39592909999999, 
        "population": "97151", 
        "rank": "304", 
        "state": "Oklahoma"
    }, 
    {
        "name": "Renton", 
        "growth_from_2000_to_2013": "88.4%", 
        "latitude": 47.48287759999999, 
        "longitude": -122.2170661, 
        "population": "97003", 
        "rank": "305", 
        "state": "Washington"
    }, 
    {
        "name": "Vista", 
        "growth_from_2000_to_2013": "7.7%", 
        "latitude": 33.2000368, 
        "longitude": -117.2425355, 
        "population": "96929", 
        "rank": "306", 
        "state": "California"
    }, 
    {
        "name": "Davie", 
        "growth_from_2000_to_2013": "17.7%", 
        "latitude": 26.0764783, 
        "longitude": -80.25211569999999, 
        "population": "96830", 
        "rank": "307", 
        "state": "Florida"
    }, 
    {
        "name": "Greeley", 
        "growth_from_2000_to_2013": "23.1%", 
        "latitude": 40.4233142, 
        "longitude": -104.7091322, 
        "population": "96539", 
        "rank": "308", 
        "state": "Colorado"
    }, 
    {
        "name": "Mission_Viejo", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 33.6000232, 
        "longitude": -117.6719953, 
        "population": "96346", 
        "rank": "309", 
        "state": "California"
    }, 
    {
        "name": "Portsmouth", 
        "growth_from_2000_to_2013": "-4.2%", 
        "latitude": 36.8354258, 
        "longitude": -76.2982742, 
        "population": "96205", 
        "rank": "310", 
        "state": "Virginia"
    }, 
    {
        "name": "Dearborn", 
        "growth_from_2000_to_2013": "-2.0%", 
        "latitude": 42.3222599, 
        "longitude": -83.17631449999999, 
        "population": "95884", 
        "rank": "311", 
        "state": "Michigan"
    }, 
    {
        "name": "South_Gate", 
        "growth_from_2000_to_2013": "-0.8%", 
        "latitude": 33.954737, 
        "longitude": -118.2120161, 
        "population": "95677", 
        "rank": "312", 
        "state": "California"
    }, 
    {
        "name": "Tuscaloosa", 
        "growth_from_2000_to_2013": "21.1%", 
        "latitude": 33.2098407, 
        "longitude": -87.56917349999999, 
        "population": "95334", 
        "rank": "313", 
        "state": "Alabama"
    }, 
    {
        "name": "Livonia", 
        "growth_from_2000_to_2013": "-5.4%", 
        "latitude": 42.36837, 
        "longitude": -83.35270969999999, 
        "population": "95208", 
        "rank": "314", 
        "state": "Michigan"
    }, 
    {
        "name": "New_Bedford", 
        "growth_from_2000_to_2013": "1.2%", 
        "latitude": 41.6362152, 
        "longitude": -70.93420499999999, 
        "population": "95078", 
        "rank": "315", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Vacaville", 
        "growth_from_2000_to_2013": "5.4%", 
        "latitude": 38.3565773, 
        "longitude": -121.9877444, 
        "population": "94275", 
        "rank": "316", 
        "state": "California"
    }, 
    {
        "name": "Brockton", 
        "growth_from_2000_to_2013": "-0.3%", 
        "latitude": 42.0834335, 
        "longitude": -71.0183787, 
        "population": "94089", 
        "rank": "317", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Roswell", 
        "growth_from_2000_to_2013": "15.2%", 
        "latitude": 34.0232431, 
        "longitude": -84.3615555, 
        "population": "94034", 
        "rank": "318", 
        "state": "Georgia"
    }, 
    {
        "name": "Beaverton", 
        "growth_from_2000_to_2013": "17.0%", 
        "latitude": 45.48706199999999, 
        "longitude": -122.8037102, 
        "population": "93542", 
        "rank": "319", 
        "state": "Oregon"
    }, 
    {
        "name": "Quincy", 
        "growth_from_2000_to_2013": "5.8%", 
        "latitude": 42.2528772, 
        "longitude": -71.0022705, 
        "population": "93494", 
        "rank": "320", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Sparks", 
        "growth_from_2000_to_2013": "39.4%", 
        "latitude": 39.5349112, 
        "longitude": -119.7526886, 
        "population": "93282", 
        "rank": "321", 
        "state": "Nevada"
    }, 
    {
        "name": "Yakima", 
        "growth_from_2000_to_2013": "11.7%", 
        "latitude": 46.6020711, 
        "longitude": -120.5058987, 
        "population": "93257", 
        "rank": "322", 
        "state": "Washington"
    }, 
    {
        "name": "Lee's Summit", 
        "growth_from_2000_to_2013": "31.2%", 
        "latitude": 38.9108408, 
        "longitude": -94.3821724, 
        "population": "93184", 
        "rank": "323", 
        "state": "Missouri"
    }, 
    {
        "name": "Federal_Way", 
        "growth_from_2000_to_2013": "8.8%", 
        "latitude": 47.3223221, 
        "longitude": -122.3126222, 
        "population": "92734", 
        "rank": "324", 
        "state": "Washington"
    }, 
    {
        "name": "Carson", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 33.8316745, 
        "longitude": -118.281693, 
        "population": "92599", 
        "rank": "325", 
        "state": "California"
    }, 
    {
        "name": "Santa_Monica", 
        "growth_from_2000_to_2013": "9.6%", 
        "latitude": 34.0194543, 
        "longitude": -118.4911912, 
        "population": "92472", 
        "rank": "326", 
        "state": "California"
    }, 
    {
        "name": "Hesperia", 
        "growth_from_2000_to_2013": "46.1%", 
        "latitude": 34.4263886, 
        "longitude": -117.3008784, 
        "population": "92147", 
        "rank": "327", 
        "state": "California"
    }, 
    {
        "name": "Allen", 
        "growth_from_2000_to_2013": "104.0%", 
        "latitude": 33.1031744, 
        "longitude": -96.67055030000002, 
        "population": "92020", 
        "rank": "328", 
        "state": "Texas"
    }, 
    {
        "name": "Rio_Rancho", 
        "growth_from_2000_to_2013": "74.4%", 
        "latitude": 35.2327544, 
        "longitude": -106.6630437, 
        "population": "91956", 
        "rank": "329", 
        "state": "New_Mexico"
    }, 
    {
        "name": "Yuma", 
        "growth_from_2000_to_2013": "16.2%", 
        "latitude": 32.6926512, 
        "longitude": -114.6276916, 
        "population": "91923", 
        "rank": "330", 
        "state": "Arizona"
    }, 
    {
        "name": "Westminster", 
        "growth_from_2000_to_2013": "3.9%", 
        "latitude": 33.7513419, 
        "longitude": -117.9939921, 
        "population": "91739", 
        "rank": "331", 
        "state": "California"
    }, 
    {
        "name": "Orem", 
        "growth_from_2000_to_2013": "8.5%", 
        "latitude": 40.2968979, 
        "longitude": -111.6946475, 
        "population": "91648", 
        "rank": "332", 
        "state": "Utah"
    }, 
    {
        "name": "Lynn", 
        "growth_from_2000_to_2013": "2.6%", 
        "latitude": 42.46676300000001, 
        "longitude": -70.9494938, 
        "population": "91589", 
        "rank": "333", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Redding", 
        "growth_from_2000_to_2013": "11.9%", 
        "latitude": 40.5865396, 
        "longitude": -122.3916754, 
        "population": "91119", 
        "rank": "334", 
        "state": "California"
    }, 
    {
        "name": "Spokane_Valley", 
        "growth_from_2000_to_2013": "12.6%", 
        "latitude": 47.6732281, 
        "longitude": -117.2393748, 
        "population": "91113", 
        "rank": "335", 
        "state": "Washington"
    }, 
    {
        "name": "Miami_Beach", 
        "growth_from_2000_to_2013": "3.3%", 
        "latitude": 25.790654, 
        "longitude": -80.1300455, 
        "population": "91026", 
        "rank": "336", 
        "state": "Florida"
    }, 
    {
        "name": "League_City", 
        "growth_from_2000_to_2013": "98.3%", 
        "latitude": 29.5074538, 
        "longitude": -95.0949303, 
        "population": "90983", 
        "rank": "337", 
        "state": "Texas"
    }, 
    {
        "name": "Lawrence", 
        "growth_from_2000_to_2013": "12.7%", 
        "latitude": 38.9716689, 
        "longitude": -95.2352501, 
        "population": "90811", 
        "rank": "338", 
        "state": "Kansas"
    }, 
    {
        "name": "Santa_Barbara", 
        "growth_from_2000_to_2013": "0.9%", 
        "latitude": 34.4208305, 
        "longitude": -119.6981901, 
        "population": "90412", 
        "rank": "339", 
        "state": "California"
    }, 
    {
        "name": "Plantation", 
        "growth_from_2000_to_2013": "8.6%", 
        "latitude": 26.1275862, 
        "longitude": -80.23310359999999, 
        "population": "90268", 
        "rank": "340", 
        "state": "Florida"
    }, 
    {
        "name": "Sandy", 
        "growth_from_2000_to_2013": "1.3%", 
        "latitude": 40.5649781, 
        "longitude": -111.8389726, 
        "population": "90231", 
        "rank": "341", 
        "state": "Utah"
    }, 
    {
        "name": "Sunrise", 
        "growth_from_2000_to_2013": "4.6%", 
        "latitude": 26.1669711, 
        "longitude": -80.25659499999999, 
        "population": "90116", 
        "rank": "342", 
        "state": "Florida"
    }, 
    {
        "name": "Macon", 
        "growth_from_2000_to_2013": "-7.3%", 
        "latitude": 32.8406946, 
        "longitude": -83.6324022, 
        "population": "89981", 
        "rank": "343", 
        "state": "Georgia"
    }, 
    {
        "name": "Longmont", 
        "growth_from_2000_to_2013": "24.4%", 
        "latitude": 40.1672068, 
        "longitude": -105.1019275, 
        "population": "89919", 
        "rank": "344", 
        "state": "Colorado"
    }, 
    {
        "name": "Boca_Raton", 
        "growth_from_2000_to_2013": "7.5%", 
        "latitude": 26.3683064, 
        "longitude": -80.1289321, 
        "population": "89407", 
        "rank": "345", 
        "state": "Florida"
    }, 
    {
        "name": "San_Marcos", 
        "growth_from_2000_to_2013": "60.0%", 
        "latitude": 33.1433723, 
        "longitude": -117.1661449, 
        "population": "89387", 
        "rank": "346", 
        "state": "California"
    }, 
    {
        "name": "Greenville", 
        "growth_from_2000_to_2013": "41.9%", 
        "latitude": 35.612661, 
        "longitude": -77.3663538, 
        "population": "89130", 
        "rank": "347", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Waukegan", 
        "growth_from_2000_to_2013": "0.5%", 
        "latitude": 42.3636331, 
        "longitude": -87.84479379999999, 
        "population": "88826", 
        "rank": "348", 
        "state": "Illinois"
    }, 
    {
        "name": "Fall_River", 
        "growth_from_2000_to_2013": "-3.7%", 
        "latitude": 41.7014912, 
        "longitude": -71.1550451, 
        "population": "88697", 
        "rank": "349", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Chico", 
        "growth_from_2000_to_2013": "14.2%", 
        "latitude": 39.7284944, 
        "longitude": -121.8374777, 
        "population": "88077", 
        "rank": "350", 
        "state": "California"
    }, 
    {
        "name": "Newton", 
        "growth_from_2000_to_2013": "4.9%", 
        "latitude": 42.3370413, 
        "longitude": -71.20922139999999, 
        "population": "87971", 
        "rank": "351", 
        "state": "Massachusetts"
    }, 
    {
        "name": "San_Leandro", 
        "growth_from_2000_to_2013": "10.3%", 
        "latitude": 37.7249296, 
        "longitude": -122.1560768, 
        "population": "87965", 
        "rank": "352", 
        "state": "California"
    }, 
    {
        "name": "Reading", 
        "growth_from_2000_to_2013": "8.0%", 
        "latitude": 40.3356483, 
        "longitude": -75.9268747, 
        "population": "87893", 
        "rank": "353", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Norwalk", 
        "growth_from_2000_to_2013": "5.6%", 
        "latitude": 41.11774399999999, 
        "longitude": -73.4081575, 
        "population": "87776", 
        "rank": "354", 
        "state": "Connecticut"
    }, 
    {
        "name": "Fort_Smith", 
        "growth_from_2000_to_2013": "8.6%", 
        "latitude": 35.3859242, 
        "longitude": -94.39854749999999, 
        "population": "87650", 
        "rank": "355", 
        "state": "Arkansas"
    }, 
    {
        "name": "Newport_Beach", 
        "growth_from_2000_to_2013": "10.4%", 
        "latitude": 33.6189101, 
        "longitude": -117.9289469, 
        "population": "87273", 
        "rank": "356", 
        "state": "California"
    }, 
    {
        "name": "Asheville", 
        "growth_from_2000_to_2013": "19.6%", 
        "latitude": 35.5950581, 
        "longitude": -82.5514869, 
        "population": "87236", 
        "rank": "357", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Nashua", 
        "growth_from_2000_to_2013": "0.4%", 
        "latitude": 42.7653662, 
        "longitude": -71.46756599999999, 
        "population": "87137", 
        "rank": "358", 
        "state": "New_Hampshire"
    }, 
    {
        "name": "Edmond", 
        "growth_from_2000_to_2013": "26.9%", 
        "latitude": 35.6528323, 
        "longitude": -97.47809540000002, 
        "population": "87004", 
        "rank": "359", 
        "state": "Oklahoma"
    }, 
    {
        "name": "Whittier", 
        "growth_from_2000_to_2013": "3.3%", 
        "latitude": 33.9791793, 
        "longitude": -118.032844, 
        "population": "86635", 
        "rank": "360", 
        "state": "California"
    }, 
    {
        "name": "Nampa", 
        "growth_from_2000_to_2013": "57.9%", 
        "latitude": 43.5407172, 
        "longitude": -116.5634624, 
        "population": "86518", 
        "rank": "361", 
        "state": "Idaho"
    }, 
    {
        "name": "Bloomington", 
        "growth_from_2000_to_2013": "1.3%", 
        "latitude": 44.840798, 
        "longitude": -93.2982799, 
        "population": "86319", 
        "rank": "362", 
        "state": "Minnesota"
    }, 
    {
        "name": "Deltona", 
        "growth_from_2000_to_2013": "23.1%", 
        "latitude": 28.9005446, 
        "longitude": -81.26367379999999, 
        "population": "86290", 
        "rank": "363", 
        "state": "Florida"
    }, 
    {
        "name": "Hawthorne", 
        "growth_from_2000_to_2013": "2.3%", 
        "latitude": 33.9164032, 
        "longitude": -118.3525748, 
        "population": "86199", 
        "rank": "364", 
        "state": "California"
    }, 
    {
        "name": "Duluth", 
        "growth_from_2000_to_2013": "-0.1%", 
        "latitude": 46.78667189999999, 
        "longitude": -92.1004852, 
        "population": "86128", 
        "rank": "365", 
        "state": "Minnesota"
    }, 
    {
        "name": "Carmel", 
        "growth_from_2000_to_2013": "60.4%", 
        "latitude": 39.978371, 
        "longitude": -86.1180435, 
        "population": "85927", 
        "rank": "366", 
        "state": "Indiana"
    }, 
    {
        "name": "Suffolk", 
        "growth_from_2000_to_2013": "33.5%", 
        "latitude": 36.7282054, 
        "longitude": -76.5835621, 
        "population": "85728", 
        "rank": "367", 
        "state": "Virginia"
    }, 
    {
        "name": "Clifton", 
        "growth_from_2000_to_2013": "7.9%", 
        "latitude": 40.8584328, 
        "longitude": -74.16375529999999, 
        "population": "85390", 
        "rank": "368", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Citrus_Heights", 
        "growth_from_2000_to_2013": "-0.1%", 
        "latitude": 38.7071247, 
        "longitude": -121.2810611, 
        "population": "85285", 
        "rank": "369", 
        "state": "California"
    }, 
    {
        "name": "Livermore", 
        "growth_from_2000_to_2013": "15.1%", 
        "latitude": 37.6818745, 
        "longitude": -121.7680088, 
        "population": "85156", 
        "rank": "370", 
        "state": "California"
    }, 
    {
        "name": "Tracy", 
        "growth_from_2000_to_2013": "45.9%", 
        "latitude": 37.7396513, 
        "longitude": -121.4252227, 
        "population": "84691", 
        "rank": "371", 
        "state": "California"
    }, 
    {
        "name": "Alhambra", 
        "growth_from_2000_to_2013": "-0.7%", 
        "latitude": 34.095287, 
        "longitude": -118.1270146, 
        "population": "84577", 
        "rank": "372", 
        "state": "California"
    }, 
    {
        "name": "Kirkland", 
        "growth_from_2000_to_2013": "87.5%", 
        "latitude": 47.6814875, 
        "longitude": -122.2087353, 
        "population": "84430", 
        "rank": "373", 
        "state": "Washington"
    }, 
    {
        "name": "Trenton", 
        "growth_from_2000_to_2013": "-1.2%", 
        "latitude": 40.2170534, 
        "longitude": -74.7429384, 
        "population": "84349", 
        "rank": "374", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Ogden", 
        "growth_from_2000_to_2013": "8.6%", 
        "latitude": 41.223, 
        "longitude": -111.9738304, 
        "population": "84249", 
        "rank": "375", 
        "state": "Utah"
    }, 
    {
        "name": "Hoover", 
        "growth_from_2000_to_2013": "32.7%", 
        "latitude": 33.4053867, 
        "longitude": -86.8113781, 
        "population": "84126", 
        "rank": "376", 
        "state": "Alabama"
    }, 
    {
        "name": "Cicero", 
        "growth_from_2000_to_2013": "-1.6%", 
        "latitude": 41.8455877, 
        "longitude": -87.7539448, 
        "population": "84103", 
        "rank": "377", 
        "state": "Illinois"
    }, 
    {
        "name": "Fishers", 
        "growth_from_2000_to_2013": "114.8%", 
        "latitude": 39.9567548, 
        "longitude": -86.01335, 
        "population": "83891", 
        "rank": "378", 
        "state": "Indiana"
    }, 
    {
        "name": "Sugar_Land", 
        "growth_from_2000_to_2013": "29.1%", 
        "latitude": 29.6196787, 
        "longitude": -95.6349463, 
        "population": "83860", 
        "rank": "379", 
        "state": "Texas"
    }, 
    {
        "name": "Danbury", 
        "growth_from_2000_to_2013": "11.4%", 
        "latitude": 41.394817, 
        "longitude": -73.4540111, 
        "population": "83684", 
        "rank": "380", 
        "state": "Connecticut"
    }, 
    {
        "name": "Meridian", 
        "growth_from_2000_to_2013": "127.6%", 
        "latitude": 43.6121087, 
        "longitude": -116.3915131, 
        "population": "83596", 
        "rank": "381", 
        "state": "Idaho"
    }, 
    {
        "name": "Indio", 
        "growth_from_2000_to_2013": "66.0%", 
        "latitude": 33.7205771, 
        "longitude": -116.2155619, 
        "population": "83539", 
        "rank": "382", 
        "state": "California"
    }, 
    {
        "name": "Concord", 
        "growth_from_2000_to_2013": "47.4%", 
        "latitude": 35.4087517, 
        "longitude": -80.579511, 
        "population": "83506", 
        "rank": "383", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Menifee", 
        "growth_from_2000_to_2013": "95.0%", 
        "latitude": 33.6971468, 
        "longitude": -117.185294, 
        "population": "83447", 
        "rank": "384", 
        "state": "California"
    }, 
    {
        "name": "Champaign", 
        "growth_from_2000_to_2013": "18.3%", 
        "latitude": 40.1164204, 
        "longitude": -88.2433829, 
        "population": "83424", 
        "rank": "385", 
        "state": "Illinois"
    }, 
    {
        "name": "Buena_Park", 
        "growth_from_2000_to_2013": "6.1%", 
        "latitude": 33.8675143, 
        "longitude": -117.9981181, 
        "population": "82882", 
        "rank": "386", 
        "state": "California"
    }, 
    {
        "name": "Troy", 
        "growth_from_2000_to_2013": "2.2%", 
        "latitude": 42.6064095, 
        "longitude": -83.1497751, 
        "population": "82821", 
        "rank": "387", 
        "state": "Michigan"
    }, 
    {
        "name": "O'Fallon", 
        "growth_from_2000_to_2013": "62.6%", 
        "latitude": 38.8106075, 
        "longitude": -90.69984769999999, 
        "population": "82809", 
        "rank": "388", 
        "state": "Missouri"
    }, 
    {
        "name": "Johns_Creek", 
        "growth_from_2000_to_2013": "36.5%", 
        "latitude": 34.0289259, 
        "longitude": -84.198579, 
        "population": "82788", 
        "rank": "389", 
        "state": "Georgia"
    }, 
    {
        "name": "Bellingham", 
        "growth_from_2000_to_2013": "21.8%", 
        "latitude": 48.74908, 
        "longitude": -122.4781473, 
        "population": "82631", 
        "rank": "390", 
        "state": "Washington"
    }, 
    {
        "name": "Westland", 
        "growth_from_2000_to_2013": "-4.7%", 
        "latitude": 42.32420399999999, 
        "longitude": -83.400211, 
        "population": "82578", 
        "rank": "391", 
        "state": "Michigan"
    }, 
    {
        "name": "Bloomington", 
        "growth_from_2000_to_2013": "16.1%", 
        "latitude": 39.165325, 
        "longitude": -86.52638569999999, 
        "population": "82575", 
        "rank": "392", 
        "state": "Indiana"
    }, 
    {
        "name": "Sioux_City", 
        "growth_from_2000_to_2013": "-2.9%", 
        "latitude": 42.4999942, 
        "longitude": -96.40030689999999, 
        "population": "82459", 
        "rank": "393", 
        "state": "Iowa"
    }, 
    {
        "name": "Warwick", 
        "growth_from_2000_to_2013": "-4.6%", 
        "latitude": 41.7001009, 
        "longitude": -71.4161671, 
        "population": "81971", 
        "rank": "394", 
        "state": "Rhode_Island"
    }, 
    {
        "name": "Hemet", 
        "growth_from_2000_to_2013": "37.6%", 
        "latitude": 33.7475203, 
        "longitude": -116.9719684, 
        "population": "81750", 
        "rank": "395", 
        "state": "California"
    }, 
    {
        "name": "Longview", 
        "growth_from_2000_to_2013": "11.6%", 
        "latitude": 32.5007037, 
        "longitude": -94.74048909999999, 
        "population": "81443", 
        "rank": "396", 
        "state": "Texas"
    }, 
    {
        "name": "Farmington_Hills", 
        "growth_from_2000_to_2013": "-0.9%", 
        "latitude": 42.4989936, 
        "longitude": -83.3677168, 
        "population": "81295", 
        "rank": "397", 
        "state": "Michigan"
    }, 
    {
        "name": "Bend", 
        "growth_from_2000_to_2013": "54.3%", 
        "latitude": 44.0581728, 
        "longitude": -121.3153096, 
        "population": "81236", 
        "rank": "398", 
        "state": "Oregon"
    }, 
    {
        "name": "Lakewood", 
        "growth_from_2000_to_2013": "2.1%", 
        "latitude": 33.8536269, 
        "longitude": -118.1339563, 
        "population": "81121", 
        "rank": "399", 
        "state": "California"
    }, 
    {
        "name": "Merced", 
        "growth_from_2000_to_2013": "25.4%", 
        "latitude": 37.3021632, 
        "longitude": -120.4829677, 
        "population": "81102", 
        "rank": "400", 
        "state": "California"
    }, 
    {
        "name": "Mission", 
        "growth_from_2000_to_2013": "74.5%", 
        "latitude": 26.2159066, 
        "longitude": -98.32529319999999, 
        "population": "81050", 
        "rank": "401", 
        "state": "Texas"
    }, 
    {
        "name": "Chino", 
        "growth_from_2000_to_2013": "15.6%", 
        "latitude": 34.0122346, 
        "longitude": -117.688944, 
        "population": "80988", 
        "rank": "402", 
        "state": "California"
    }, 
    {
        "name": "Redwood_City", 
        "growth_from_2000_to_2013": "7.1%", 
        "latitude": 37.48521520000001, 
        "longitude": -122.2363548, 
        "population": "80872", 
        "rank": "403", 
        "state": "California"
    }, 
    {
        "name": "Edinburg", 
        "growth_from_2000_to_2013": "65.1%", 
        "latitude": 26.3017374, 
        "longitude": -98.1633432, 
        "population": "80836", 
        "rank": "404", 
        "state": "Texas"
    }, 
    {
        "name": "Cranston", 
        "growth_from_2000_to_2013": "1.4%", 
        "latitude": 41.7798226, 
        "longitude": -71.4372796, 
        "population": "80566", 
        "rank": "405", 
        "state": "Rhode_Island"
    }, 
    {
        "name": "Parma", 
        "growth_from_2000_to_2013": "-5.9%", 
        "latitude": 41.4047742, 
        "longitude": -81.7229086, 
        "population": "80429", 
        "rank": "406", 
        "state": "Ohio"
    }, 
    {
        "name": "New_Rochelle", 
        "growth_from_2000_to_2013": "9.9%", 
        "latitude": 40.9114882, 
        "longitude": -73.7823549, 
        "population": "79446", 
        "rank": "407", 
        "state": "New_York"
    }, 
    {
        "name": "Lake_Forest", 
        "growth_from_2000_to_2013": "4.2%", 
        "latitude": 33.6469661, 
        "longitude": -117.689218, 
        "population": "79312", 
        "rank": "408", 
        "state": "California"
    }, 
    {
        "name": "Napa", 
        "growth_from_2000_to_2013": "8.4%", 
        "latitude": 38.2975381, 
        "longitude": -122.286865, 
        "population": "79068", 
        "rank": "409", 
        "state": "California"
    }, 
    {
        "name": "Hammond", 
        "growth_from_2000_to_2013": "-4.6%", 
        "latitude": 41.5833688, 
        "longitude": -87.5000412, 
        "population": "78967", 
        "rank": "410", 
        "state": "Indiana"
    }, 
    {
        "name": "Fayetteville", 
        "growth_from_2000_to_2013": "32.9%", 
        "latitude": 36.0625795, 
        "longitude": -94.1574263, 
        "population": "78960", 
        "rank": "411", 
        "state": "Arkansas"
    }, 
    {
        "name": "Bloomington", 
        "growth_from_2000_to_2013": "20.1%", 
        "latitude": 40.4842027, 
        "longitude": -88.99368729999999, 
        "population": "78902", 
        "rank": "412", 
        "state": "Illinois"
    }, 
    {
        "name": "Avondale", 
        "growth_from_2000_to_2013": "111.5%", 
        "latitude": 33.4355977, 
        "longitude": -112.3496021, 
        "population": "78822", 
        "rank": "413", 
        "state": "Arizona"
    }, 
    {
        "name": "Somerville", 
        "growth_from_2000_to_2013": "1.6%", 
        "latitude": 42.3875968, 
        "longitude": -71.0994968, 
        "population": "78804", 
        "rank": "414", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Palm_Coast", 
        "growth_from_2000_to_2013": "137.2%", 
        "latitude": 29.5844524, 
        "longitude": -81.20786989999999, 
        "population": "78740", 
        "rank": "415", 
        "state": "Florida"
    }, 
    {
        "name": "Bryan", 
        "growth_from_2000_to_2013": "19.3%", 
        "latitude": 30.6743643, 
        "longitude": -96.3699632, 
        "population": "78709", 
        "rank": "416", 
        "state": "Texas"
    }, 
    {
        "name": "Gary", 
        "growth_from_2000_to_2013": "-23.4%", 
        "latitude": 41.5933696, 
        "longitude": -87.3464271, 
        "population": "78450", 
        "rank": "417", 
        "state": "Indiana"
    }, 
    {
        "name": "Largo", 
        "growth_from_2000_to_2013": "5.1%", 
        "latitude": 27.9094665, 
        "longitude": -82.7873244, 
        "population": "78409", 
        "rank": "418", 
        "state": "Florida"
    }, 
    {
        "name": "Brooklyn_Park", 
        "growth_from_2000_to_2013": "16.0%", 
        "latitude": 45.0941315, 
        "longitude": -93.3563405, 
        "population": "78373", 
        "rank": "419", 
        "state": "Minnesota"
    }, 
    {
        "name": "Tustin", 
        "growth_from_2000_to_2013": "15.6%", 
        "latitude": 33.7458511, 
        "longitude": -117.826166, 
        "population": "78327", 
        "rank": "420", 
        "state": "California"
    }, 
    {
        "name": "Racine", 
        "growth_from_2000_to_2013": "-4.4%", 
        "latitude": 42.7261309, 
        "longitude": -87.78285230000002, 
        "population": "78199", 
        "rank": "421", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Deerfield_Beach", 
        "growth_from_2000_to_2013": "4.8%", 
        "latitude": 26.3184123, 
        "longitude": -80.09976569999999, 
        "population": "78041", 
        "rank": "422", 
        "state": "Florida"
    }, 
    {
        "name": "Lynchburg", 
        "growth_from_2000_to_2013": "19.5%", 
        "latitude": 37.4137536, 
        "longitude": -79.14224639999999, 
        "population": "78014", 
        "rank": "423", 
        "state": "Virginia"
    }, 
    {
        "name": "Mountain_View", 
        "growth_from_2000_to_2013": "10.1%", 
        "latitude": 37.3860517, 
        "longitude": -122.0838511, 
        "population": "77846", 
        "rank": "424", 
        "state": "California"
    }, 
    {
        "name": "Medford", 
        "growth_from_2000_to_2013": "17.1%", 
        "latitude": 42.3265152, 
        "longitude": -122.8755949, 
        "population": "77677", 
        "rank": "425", 
        "state": "Oregon"
    }, 
    {
        "name": "Lawrence", 
        "growth_from_2000_to_2013": "7.5%", 
        "latitude": 42.7070354, 
        "longitude": -71.1631137, 
        "population": "77657", 
        "rank": "426", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Bellflower", 
        "growth_from_2000_to_2013": "6.3%", 
        "latitude": 33.8816818, 
        "longitude": -118.1170117, 
        "population": "77593", 
        "rank": "427", 
        "state": "California"
    }, 
    {
        "name": "Melbourne", 
        "growth_from_2000_to_2013": "5.9%", 
        "latitude": 28.0836269, 
        "longitude": -80.60810889999999, 
        "population": "77508", 
        "rank": "428", 
        "state": "Florida"
    }, 
    {
        "name": "St. Joseph", 
        "growth_from_2000_to_2013": "4.1%", 
        "latitude": 39.7674578, 
        "longitude": -94.84668099999999, 
        "population": "77147", 
        "rank": "429", 
        "state": "Missouri"
    }, 
    {
        "name": "Camden", 
        "growth_from_2000_to_2013": "-3.6%", 
        "latitude": 39.9259463, 
        "longitude": -75.1196199, 
        "population": "76903", 
        "rank": "430", 
        "state": "New_Jersey"
    }, 
    {
        "name": "St. George", 
        "growth_from_2000_to_2013": "53.1%", 
        "latitude": 37.0965278, 
        "longitude": -113.5684164, 
        "population": "76817", 
        "rank": "431", 
        "state": "Utah"
    }, 
    {
        "name": "Kennewick", 
        "growth_from_2000_to_2013": "29.1%", 
        "latitude": 46.2112458, 
        "longitude": -119.1372338, 
        "population": "76762", 
        "rank": "432", 
        "state": "Washington"
    }, 
    {
        "name": "Baldwin_Park", 
        "growth_from_2000_to_2013": "0.8%", 
        "latitude": 34.0852868, 
        "longitude": -117.9608978, 
        "population": "76635", 
        "rank": "433", 
        "state": "California"
    }, 
    {
        "name": "Chino_Hills", 
        "growth_from_2000_to_2013": "13.6%", 
        "latitude": 33.9898188, 
        "longitude": -117.7325848, 
        "population": "76572", 
        "rank": "434", 
        "state": "California"
    }, 
    {
        "name": "Alameda", 
        "growth_from_2000_to_2013": "5.4%", 
        "latitude": 37.7652065, 
        "longitude": -122.2416355, 
        "population": "76419", 
        "rank": "435", 
        "state": "California"
    }, 
    {
        "name": "Albany", 
        "growth_from_2000_to_2013": "-0.6%", 
        "latitude": 31.5785074, 
        "longitude": -84.15574099999999, 
        "population": "76185", 
        "rank": "436", 
        "state": "Georgia"
    }, 
    {
        "name": "Arlington_Heights", 
        "growth_from_2000_to_2013": "-0.6%", 
        "latitude": 42.0883603, 
        "longitude": -87.98062650000001, 
        "population": "75994", 
        "rank": "437", 
        "state": "Illinois"
    }, 
    {
        "name": "Scranton", 
        "growth_from_2000_to_2013": "0.0%", 
        "latitude": 41.408969, 
        "longitude": -75.66241219999999, 
        "population": "75806", 
        "rank": "438", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Evanston", 
        "growth_from_2000_to_2013": "1.9%", 
        "latitude": 42.0450722, 
        "longitude": -87.68769689999999, 
        "population": "75570", 
        "rank": "439", 
        "state": "Illinois"
    }, 
    {
        "name": "Kalamazoo", 
        "growth_from_2000_to_2013": "-1.9%", 
        "latitude": 42.2917069, 
        "longitude": -85.5872286, 
        "population": "75548", 
        "rank": "440", 
        "state": "Michigan"
    }, 
    {
        "name": "Baytown", 
        "growth_from_2000_to_2013": "13.1%", 
        "latitude": 29.7355047, 
        "longitude": -94.97742740000001, 
        "population": "75418", 
        "rank": "441", 
        "state": "Texas"
    }, 
    {
        "name": "Upland", 
        "growth_from_2000_to_2013": "9.5%", 
        "latitude": 34.09751, 
        "longitude": -117.6483876, 
        "population": "75413", 
        "rank": "442", 
        "state": "California"
    }, 
    {
        "name": "Springdale", 
        "growth_from_2000_to_2013": "57.1%", 
        "latitude": 36.18674420000001, 
        "longitude": -94.1288141, 
        "population": "75229", 
        "rank": "443", 
        "state": "Arkansas"
    }, 
    {
        "name": "Bethlehem", 
        "growth_from_2000_to_2013": "5.2%", 
        "latitude": 40.6259316, 
        "longitude": -75.37045789999999, 
        "population": "75018", 
        "rank": "444", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Schaumburg", 
        "growth_from_2000_to_2013": "-0.5%", 
        "latitude": 42.0333607, 
        "longitude": -88.0834059, 
        "population": "74907", 
        "rank": "445", 
        "state": "Illinois"
    }, 
    {
        "name": "Mount_Pleasant", 
        "growth_from_2000_to_2013": "53.2%", 
        "latitude": 32.8323225, 
        "longitude": -79.82842579999999, 
        "population": "74885", 
        "rank": "446", 
        "state": "South_Carolina"
    }, 
    {
        "name": "Auburn", 
        "growth_from_2000_to_2013": "34.9%", 
        "latitude": 47.30732279999999, 
        "longitude": -122.2284532, 
        "population": "74860", 
        "rank": "447", 
        "state": "Washington"
    }, 
    {
        "name": "Decatur", 
        "growth_from_2000_to_2013": "-8.7%", 
        "latitude": 39.8403147, 
        "longitude": -88.9548001, 
        "population": "74710", 
        "rank": "448", 
        "state": "Illinois"
    }, 
    {
        "name": "San_Ramon", 
        "growth_from_2000_to_2013": "65.8%", 
        "latitude": 37.7799273, 
        "longitude": -121.9780153, 
        "population": "74513", 
        "rank": "449", 
        "state": "California"
    }, 
    {
        "name": "Pleasanton", 
        "growth_from_2000_to_2013": "15.2%", 
        "latitude": 37.6624312, 
        "longitude": -121.8746789, 
        "population": "74110", 
        "rank": "450", 
        "state": "California"
    }, 
    {
        "name": "Wyoming", 
        "growth_from_2000_to_2013": "6.5%", 
        "latitude": 42.9133602, 
        "longitude": -85.7053085, 
        "population": "74100", 
        "rank": "451", 
        "state": "Michigan"
    }, 
    {
        "name": "Lake_Charles", 
        "growth_from_2000_to_2013": "3.0%", 
        "latitude": 30.2265949, 
        "longitude": -93.2173758, 
        "population": "74024", 
        "rank": "452", 
        "state": "Louisiana"
    }, 
    {
        "name": "Plymouth", 
        "growth_from_2000_to_2013": "12.0%", 
        "latitude": 45.0105194, 
        "longitude": -93.4555093, 
        "population": "73987", 
        "rank": "453", 
        "state": "Minnesota"
    }, 
    {
        "name": "Bolingbrook", 
        "growth_from_2000_to_2013": "29.7%", 
        "latitude": 41.69864159999999, 
        "longitude": -88.0683955, 
        "population": "73936", 
        "rank": "454", 
        "state": "Illinois"
    }, 
    {
        "name": "Pharr", 
        "growth_from_2000_to_2013": "55.7%", 
        "latitude": 26.1947962, 
        "longitude": -98.1836216, 
        "population": "73790", 
        "rank": "455", 
        "state": "Texas"
    }, 
    {
        "name": "Appleton", 
        "growth_from_2000_to_2013": "4.5%", 
        "latitude": 44.2619309, 
        "longitude": -88.41538469999999, 
        "population": "73596", 
        "rank": "456", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Gastonia", 
        "growth_from_2000_to_2013": "8.2%", 
        "latitude": 35.262082, 
        "longitude": -81.18730049999999, 
        "population": "73209", 
        "rank": "457", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Folsom", 
        "growth_from_2000_to_2013": "38.6%", 
        "latitude": 38.6779591, 
        "longitude": -121.1760583, 
        "population": "73098", 
        "rank": "458", 
        "state": "California"
    }, 
    {
        "name": "Southfield", 
        "growth_from_2000_to_2013": "-6.7%", 
        "latitude": 42.4733688, 
        "longitude": -83.2218731, 
        "population": "73006", 
        "rank": "459", 
        "state": "Michigan"
    }, 
    {
        "name": "Rochester_Hills", 
        "growth_from_2000_to_2013": "5.7%", 
        "latitude": 42.65836609999999, 
        "longitude": -83.1499322, 
        "population": "72952", 
        "rank": "460", 
        "state": "Michigan"
    }, 
    {
        "name": "New_Britain", 
        "growth_from_2000_to_2013": "1.9%", 
        "latitude": 41.6612104, 
        "longitude": -72.7795419, 
        "population": "72939", 
        "rank": "461", 
        "state": "Connecticut"
    }, 
    {
        "name": "Goodyear", 
        "growth_from_2000_to_2013": "271.0%", 
        "latitude": 33.4353394, 
        "longitude": -112.3576567, 
        "population": "72864", 
        "rank": "462", 
        "state": "Arizona"
    }, 
    {
        "name": "Canton", 
        "growth_from_2000_to_2013": "-10.3%", 
        "latitude": 40.79894729999999, 
        "longitude": -81.378447, 
        "population": "72535", 
        "rank": "463", 
        "state": "Ohio"
    }, 
    {
        "name": "Warner_Robins", 
        "growth_from_2000_to_2013": "45.7%", 
        "latitude": 32.6130007, 
        "longitude": -83.624201, 
        "population": "72531", 
        "rank": "464", 
        "state": "Georgia"
    }, 
    {
        "name": "Union_City", 
        "growth_from_2000_to_2013": "7.4%", 
        "latitude": 37.5933918, 
        "longitude": -122.0438298, 
        "population": "72528", 
        "rank": "465", 
        "state": "California"
    }, 
    {
        "name": "Perris", 
        "growth_from_2000_to_2013": "98.7%", 
        "latitude": 33.7825194, 
        "longitude": -117.2286478, 
        "population": "72326", 
        "rank": "466", 
        "state": "California"
    }, 
    {
        "name": "Manteca", 
        "growth_from_2000_to_2013": "42.7%", 
        "latitude": 37.7974273, 
        "longitude": -121.2160526, 
        "population": "71948", 
        "rank": "467", 
        "state": "California"
    }, 
    {
        "name": "Iowa_City", 
        "growth_from_2000_to_2013": "13.8%", 
        "latitude": 41.6611277, 
        "longitude": -91.5301683, 
        "population": "71591", 
        "rank": "468", 
        "state": "Iowa"
    }, 
    {
        "name": "Jonesboro", 
        "growth_from_2000_to_2013": "28.3%", 
        "latitude": 35.84229670000001, 
        "longitude": -90.704279, 
        "population": "71551", 
        "rank": "469", 
        "state": "Arkansas"
    }, 
    {
        "name": "Wilmington", 
        "growth_from_2000_to_2013": "-1.6%", 
        "latitude": 39.7390721, 
        "longitude": -75.5397878, 
        "population": "71525", 
        "rank": "470", 
        "state": "Delaware"
    }, 
    {
        "name": "Lynwood", 
        "growth_from_2000_to_2013": "2.0%", 
        "latitude": 33.930293, 
        "longitude": -118.2114603, 
        "population": "71371", 
        "rank": "471", 
        "state": "California"
    }, 
    {
        "name": "Loveland", 
        "growth_from_2000_to_2013": "37.4%", 
        "latitude": 40.3977612, 
        "longitude": -105.0749801, 
        "population": "71334", 
        "rank": "472", 
        "state": "Colorado"
    }, 
    {
        "name": "Pawtucket", 
        "growth_from_2000_to_2013": "-2.5%", 
        "latitude": 41.878711, 
        "longitude": -71.38255579999999, 
        "population": "71172", 
        "rank": "473", 
        "state": "Rhode_Island"
    }, 
    {
        "name": "Boynton_Beach", 
        "growth_from_2000_to_2013": "17.3%", 
        "latitude": 26.5317866, 
        "longitude": -80.0905465, 
        "population": "71097", 
        "rank": "474", 
        "state": "Florida"
    }, 
    {
        "name": "Waukesha", 
        "growth_from_2000_to_2013": "8.0%", 
        "latitude": 43.0116784, 
        "longitude": -88.2314813, 
        "population": "71016", 
        "rank": "475", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Gulfport", 
        "growth_from_2000_to_2013": "-0.6%", 
        "latitude": 30.3674198, 
        "longitude": -89.0928155, 
        "population": "71012", 
        "rank": "476", 
        "state": "Mississippi"
    }, 
    {
        "name": "Apple_Valley", 
        "growth_from_2000_to_2013": "29.9%", 
        "latitude": 34.5008311, 
        "longitude": -117.1858759, 
        "population": "70924", 
        "rank": "477", 
        "state": "California"
    }, 
    {
        "name": "Passaic", 
        "growth_from_2000_to_2013": "4.3%", 
        "latitude": 40.8567662, 
        "longitude": -74.1284764, 
        "population": "70868", 
        "rank": "478", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Rapid_City", 
        "growth_from_2000_to_2013": "17.9%", 
        "latitude": 44.0805434, 
        "longitude": -103.2310149, 
        "population": "70812", 
        "rank": "479", 
        "state": "South_Dakota"
    }, 
    {
        "name": "Layton", 
        "growth_from_2000_to_2013": "20.2%", 
        "latitude": 41.0602216, 
        "longitude": -111.9710529, 
        "population": "70790", 
        "rank": "480", 
        "state": "Utah"
    }, 
    {
        "name": "Lafayette", 
        "growth_from_2000_to_2013": "14.5%", 
        "latitude": 40.4167022, 
        "longitude": -86.87528689999999, 
        "population": "70373", 
        "rank": "481", 
        "state": "Indiana"
    }, 
    {
        "name": "Turlock", 
        "growth_from_2000_to_2013": "23.5%", 
        "latitude": 37.4946568, 
        "longitude": -120.8465941, 
        "population": "70365", 
        "rank": "482", 
        "state": "California"
    }, 
    {
        "name": "Muncie", 
        "growth_from_2000_to_2013": "-0.7%", 
        "latitude": 40.1933767, 
        "longitude": -85.3863599, 
        "population": "70316", 
        "rank": "483", 
        "state": "Indiana"
    }, 
    {
        "name": "Temple", 
        "growth_from_2000_to_2013": "27.1%", 
        "latitude": 31.0982344, 
        "longitude": -97.342782, 
        "population": "70190", 
        "rank": "484", 
        "state": "Texas"
    }, 
    {
        "name": "Missouri_City", 
        "growth_from_2000_to_2013": "31.1%", 
        "latitude": 29.6185669, 
        "longitude": -95.5377215, 
        "population": "70185", 
        "rank": "485", 
        "state": "Texas"
    }, 
    {
        "name": "Redlands", 
        "growth_from_2000_to_2013": "9.4%", 
        "latitude": 34.0555693, 
        "longitude": -117.1825381, 
        "population": "69999", 
        "rank": "486", 
        "state": "California"
    }, 
    {
        "name": "Santa_Fe", 
        "growth_from_2000_to_2013": "10.5%", 
        "latitude": 35.6869752, 
        "longitude": -105.937799, 
        "population": "69976", 
        "rank": "487", 
        "state": "New_Mexico"
    }, 
    {
        "name": "Lauderhill", 
        "growth_from_2000_to_2013": "4.2%", 
        "latitude": 26.1403635, 
        "longitude": -80.2133808, 
        "population": "69813", 
        "rank": "488", 
        "state": "Florida"
    }, 
    {
        "name": "Milpitas", 
        "growth_from_2000_to_2013": "11.0%", 
        "latitude": 37.4323341, 
        "longitude": -121.8995741, 
        "population": "69783", 
        "rank": "489", 
        "state": "California"
    }, 
    {
        "name": "Palatine", 
        "growth_from_2000_to_2013": "4.5%", 
        "latitude": 42.1103041, 
        "longitude": -88.03424000000001, 
        "population": "69350", 
        "rank": "490", 
        "state": "Illinois"
    }, 
    {
        "name": "Missoula", 
        "growth_from_2000_to_2013": "19.7%", 
        "latitude": 46.87871759999999, 
        "longitude": -113.996586, 
        "population": "69122", 
        "rank": "491", 
        "state": "Montana"
    }, 
    {
        "name": "Rock_Hill", 
        "growth_from_2000_to_2013": "36.0%", 
        "latitude": 34.9248667, 
        "longitude": -81.02507840000001, 
        "population": "69103", 
        "rank": "492", 
        "state": "South_Carolina"
    }, 
    {
        "name": "Jacksonville", 
        "growth_from_2000_to_2013": "5.0%", 
        "latitude": 34.7540524, 
        "longitude": -77.4302414, 
        "population": "69079", 
        "rank": "493", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Franklin", 
        "growth_from_2000_to_2013": "48.5%", 
        "latitude": 35.9250637, 
        "longitude": -86.8688899, 
        "population": "68886", 
        "rank": "494", 
        "state": "Tennessee"
    }, 
    {
        "name": "Flagstaff", 
        "growth_from_2000_to_2013": "29.3%", 
        "latitude": 35.1982836, 
        "longitude": -111.651302, 
        "population": "68667", 
        "rank": "495", 
        "state": "Arizona"
    }, 
    {
        "name": "Flower_Mound", 
        "growth_from_2000_to_2013": "32.5%", 
        "latitude": 33.0145673, 
        "longitude": -97.0969552, 
        "population": "68609", 
        "rank": "496", 
        "state": "Texas"
    }, 
    {
        "name": "Weston", 
        "growth_from_2000_to_2013": "34.5%", 
        "latitude": 26.1003654, 
        "longitude": -80.3997748, 
        "population": "68388", 
        "rank": "497", 
        "state": "Florida"
    }, 
    {
        "name": "Waterloo", 
        "growth_from_2000_to_2013": "-0.5%", 
        "latitude": 42.492786, 
        "longitude": -92.34257749999999, 
        "population": "68366", 
        "rank": "498", 
        "state": "Iowa"
    }, 
    {
        "name": "Union_City", 
        "growth_from_2000_to_2013": "1.7%", 
        "latitude": 40.6975898, 
        "longitude": -74.26316349999999, 
        "population": "68247", 
        "rank": "499", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Mount_Vernon", 
        "growth_from_2000_to_2013": "-0.2%", 
        "latitude": 40.9125992, 
        "longitude": -73.8370786, 
        "population": "68224", 
        "rank": "500", 
        "state": "New_York"
    }, 
    {
        "name": "Fort_Myers", 
        "growth_from_2000_to_2013": "31.2%", 
        "latitude": 26.640628, 
        "longitude": -81.8723084, 
        "population": "68190", 
        "rank": "501", 
        "state": "Florida"
    }, 
    {
        "name": "Dothan", 
        "growth_from_2000_to_2013": "16.6%", 
        "latitude": 31.2232313, 
        "longitude": -85.3904888, 
        "population": "68001", 
        "rank": "502", 
        "state": "Alabama"
    }, 
    {
        "name": "Rancho_Cordova", 
        "growth_from_2000_to_2013": "26.4%", 
        "latitude": 38.5890723, 
        "longitude": -121.302728, 
        "population": "67911", 
        "rank": "503", 
        "state": "California"
    }, 
    {
        "name": "Redondo_Beach", 
        "growth_from_2000_to_2013": "6.7%", 
        "latitude": 33.8491816, 
        "longitude": -118.3884078, 
        "population": "67815", 
        "rank": "504", 
        "state": "California"
    }, 
    {
        "name": "Jackson", 
        "growth_from_2000_to_2013": "12.9%", 
        "latitude": 35.6145169, 
        "longitude": -88.81394689999999, 
        "population": "67685", 
        "rank": "505", 
        "state": "Tennessee"
    }, 
    {
        "name": "Pasco", 
        "growth_from_2000_to_2013": "98.5%", 
        "latitude": 46.2395793, 
        "longitude": -119.1005657, 
        "population": "67599", 
        "rank": "506", 
        "state": "Washington"
    }, 
    {
        "name": "St. Charles", 
        "growth_from_2000_to_2013": "11.3%", 
        "latitude": 38.7881062, 
        "longitude": -90.4974359, 
        "population": "67569", 
        "rank": "507", 
        "state": "Missouri"
    }, 
    {
        "name": "Eau_Claire", 
        "growth_from_2000_to_2013": "8.7%", 
        "latitude": 44.811349, 
        "longitude": -91.4984941, 
        "population": "67545", 
        "rank": "508", 
        "state": "Wisconsin"
    }, 
    {
        "name": "North Richland Hills", 
        "growth_from_2000_to_2013": "20.2%", 
        "latitude": 32.8342952, 
        "longitude": -97.2289029, 
        "population": "67317", 
        "rank": "509", 
        "state": "Texas"
    }, 
    {
        "name": "Bismarck", 
        "growth_from_2000_to_2013": "20.1%", 
        "latitude": 46.8083268, 
        "longitude": -100.7837392, 
        "population": "67034", 
        "rank": "510", 
        "state": "North_Dakota"
    }, 
    {
        "name": "Yorba_Linda", 
        "growth_from_2000_to_2013": "13.4%", 
        "latitude": 33.8886259, 
        "longitude": -117.8131125, 
        "population": "67032", 
        "rank": "511", 
        "state": "California"
    }, 
    {
        "name": "Kenner", 
        "growth_from_2000_to_2013": "-4.8%", 
        "latitude": 29.9940924, 
        "longitude": -90.2417434, 
        "population": "66975", 
        "rank": "512", 
        "state": "Louisiana"
    }, 
    {
        "name": "Walnut_Creek", 
        "growth_from_2000_to_2013": "3.5%", 
        "latitude": 37.9100783, 
        "longitude": -122.0651819, 
        "population": "66900", 
        "rank": "513", 
        "state": "California"
    }, 
    {
        "name": "Frederick", 
        "growth_from_2000_to_2013": "25.9%", 
        "latitude": 39.41426879999999, 
        "longitude": -77.4105409, 
        "population": "66893", 
        "rank": "514", 
        "state": "Maryland"
    }, 
    {
        "name": "Oshkosh", 
        "growth_from_2000_to_2013": "5.3%", 
        "latitude": 44.0247062, 
        "longitude": -88.5426136, 
        "population": "66778", 
        "rank": "515", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Pittsburg", 
        "growth_from_2000_to_2013": "16.6%", 
        "latitude": 38.0279762, 
        "longitude": -121.8846806, 
        "population": "66695", 
        "rank": "516", 
        "state": "California"
    }, 
    {
        "name": "Palo_Alto", 
        "growth_from_2000_to_2013": "13.7%", 
        "latitude": 37.4418834, 
        "longitude": -122.1430195, 
        "population": "66642", 
        "rank": "517", 
        "state": "California"
    }, 
    {
        "name": "Bossier_City", 
        "growth_from_2000_to_2013": "17.4%", 
        "latitude": 32.5159852, 
        "longitude": -93.7321228, 
        "population": "66333", 
        "rank": "518", 
        "state": "Louisiana"
    }, 
    {
        "name": "Portland", 
        "growth_from_2000_to_2013": "3.2%", 
        "latitude": 43.66147100000001, 
        "longitude": -70.2553259, 
        "population": "66318", 
        "rank": "519", 
        "state": "Maine"
    }, 
    {
        "name": "St. Cloud", 
        "growth_from_2000_to_2013": "10.9%", 
        "latitude": 45.5579451, 
        "longitude": -94.16324039999999, 
        "population": "66297", 
        "rank": "520", 
        "state": "Minnesota"
    }, 
    {
        "name": "Davis", 
        "growth_from_2000_to_2013": "11.9%", 
        "latitude": 38.5449065, 
        "longitude": -121.7405167, 
        "population": "66205", 
        "rank": "521", 
        "state": "California"
    }, 
    {
        "name": "South San Francisco", 
        "growth_from_2000_to_2013": "9.1%", 
        "latitude": 37.654656, 
        "longitude": -122.4077498, 
        "population": "66174", 
        "rank": "522", 
        "state": "California"
    }, 
    {
        "name": "Camarillo", 
        "growth_from_2000_to_2013": "14.9%", 
        "latitude": 34.2163937, 
        "longitude": -119.0376023, 
        "population": "66086", 
        "rank": "523", 
        "state": "California"
    }, 
    {
        "name": "North Little Rock", 
        "growth_from_2000_to_2013": "9.0%", 
        "latitude": 34.769536, 
        "longitude": -92.2670941, 
        "population": "66075", 
        "rank": "524", 
        "state": "Arkansas"
    }, 
    {
        "name": "Schenectady", 
        "growth_from_2000_to_2013": "6.7%", 
        "latitude": 42.8142432, 
        "longitude": -73.9395687, 
        "population": "65902", 
        "rank": "525", 
        "state": "New_York"
    }, 
    {
        "name": "Gaithersburg", 
        "growth_from_2000_to_2013": "24.2%", 
        "latitude": 39.1434406, 
        "longitude": -77.2013705, 
        "population": "65690", 
        "rank": "526", 
        "state": "Maryland"
    }, 
    {
        "name": "Harlingen", 
        "growth_from_2000_to_2013": "11.6%", 
        "latitude": 26.1906306, 
        "longitude": -97.69610259999999, 
        "population": "65665", 
        "rank": "527", 
        "state": "Texas"
    }, 
    {
        "name": "Woodbury", 
        "growth_from_2000_to_2013": "39.8%", 
        "latitude": 44.9238552, 
        "longitude": -92.9593797, 
        "population": "65656", 
        "rank": "528", 
        "state": "Minnesota"
    }, 
    {
        "name": "Eagan", 
        "growth_from_2000_to_2013": "2.6%", 
        "latitude": 44.8041322, 
        "longitude": -93.1668858, 
        "population": "65453", 
        "rank": "529", 
        "state": "Minnesota"
    }, 
    {
        "name": "Yuba_City", 
        "growth_from_2000_to_2013": "27.9%", 
        "latitude": 39.1404477, 
        "longitude": -121.6169108, 
        "population": "65416", 
        "rank": "530", 
        "state": "California"
    }, 
    {
        "name": "Maple_Grove", 
        "growth_from_2000_to_2013": "27.3%", 
        "latitude": 45.0724642, 
        "longitude": -93.4557877, 
        "population": "65415", 
        "rank": "531", 
        "state": "Minnesota"
    }, 
    {
        "name": "Youngstown", 
        "growth_from_2000_to_2013": "-20.2%", 
        "latitude": 41.0997803, 
        "longitude": -80.6495194, 
        "population": "65184", 
        "rank": "532", 
        "state": "Ohio"
    }, 
    {
        "name": "Skokie", 
        "growth_from_2000_to_2013": "2.8%", 
        "latitude": 42.0324025, 
        "longitude": -87.7416246, 
        "population": "65176", 
        "rank": "533", 
        "state": "Illinois"
    }, 
    {
        "name": "Kissimmee", 
        "growth_from_2000_to_2013": "32.6%", 
        "latitude": 28.2919557, 
        "longitude": -81.40757099999999, 
        "population": "65173", 
        "rank": "534", 
        "state": "Florida"
    }, 
    {
        "name": "Johnson_City", 
        "growth_from_2000_to_2013": "16.2%", 
        "latitude": 36.3134397, 
        "longitude": -82.3534727, 
        "population": "65123", 
        "rank": "535", 
        "state": "Tennessee"
    }, 
    {
        "name": "Victoria", 
        "growth_from_2000_to_2013": "7.5%", 
        "latitude": 28.8052674, 
        "longitude": -97.0035982, 
        "population": "65098", 
        "rank": "536", 
        "state": "Texas"
    }, 
    {
        "name": "San_Clemente", 
        "growth_from_2000_to_2013": "28.6%", 
        "latitude": 33.4269728, 
        "longitude": -117.6119925, 
        "population": "65040", 
        "rank": "537", 
        "state": "California"
    }, 
    {
        "name": "Bayonne", 
        "growth_from_2000_to_2013": "5.1%", 
        "latitude": 40.6687141, 
        "longitude": -74.1143091, 
        "population": "65028", 
        "rank": "538", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Laguna_Niguel", 
        "growth_from_2000_to_2013": "2.8%", 
        "latitude": 33.5225261, 
        "longitude": -117.7075526, 
        "population": "64652", 
        "rank": "539", 
        "state": "California"
    }, 
    {
        "name": "East_Orange", 
        "growth_from_2000_to_2013": "-7.4%", 
        "latitude": 40.767323, 
        "longitude": -74.2048677, 
        "population": "64544", 
        "rank": "540", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Shawnee", 
        "growth_from_2000_to_2013": "32.2%", 
        "latitude": 39.02284849999999, 
        "longitude": -94.7151865, 
        "population": "64323", 
        "rank": "541", 
        "state": "Kansas"
    }, 
    {
        "name": "Homestead", 
        "growth_from_2000_to_2013": "100.7%", 
        "latitude": 25.4687224, 
        "longitude": -80.4775569, 
        "population": "64079", 
        "rank": "542", 
        "state": "Florida"
    }, 
    {
        "name": "Rockville", 
        "growth_from_2000_to_2013": "34.0%", 
        "latitude": 39.0839973, 
        "longitude": -77.1527578, 
        "population": "64072", 
        "rank": "544", 
        "state": "Maryland"
    }, 
    {
        "name": "Delray_Beach", 
        "growth_from_2000_to_2013": "6.1%", 
        "latitude": 26.4614625, 
        "longitude": -80.0728201, 
        "population": "64072", 
        "rank": "543", 
        "state": "Florida"
    }, 
    {
        "name": "Janesville", 
        "growth_from_2000_to_2013": "5.6%", 
        "latitude": 42.6827885, 
        "longitude": -89.0187222, 
        "population": "63820", 
        "rank": "545", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Conway", 
        "growth_from_2000_to_2013": "46.1%", 
        "latitude": 35.0886963, 
        "longitude": -92.4421011, 
        "population": "63816", 
        "rank": "546", 
        "state": "Arkansas"
    }, 
    {
        "name": "Pico_Rivera", 
        "growth_from_2000_to_2013": "0.4%", 
        "latitude": 33.9830688, 
        "longitude": -118.096735, 
        "population": "63771", 
        "rank": "547", 
        "state": "California"
    }, 
    {
        "name": "Lorain", 
        "growth_from_2000_to_2013": "-7.2%", 
        "latitude": 41.452819, 
        "longitude": -82.1823746, 
        "population": "63710", 
        "rank": "548", 
        "state": "Ohio"
    }, 
    {
        "name": "Montebello", 
        "growth_from_2000_to_2013": "2.0%", 
        "latitude": 34.0165053, 
        "longitude": -118.1137535, 
        "population": "63495", 
        "rank": "549", 
        "state": "California"
    }, 
    {
        "name": "Lodi", 
        "growth_from_2000_to_2013": "10.1%", 
        "latitude": 38.1341477, 
        "longitude": -121.2722194, 
        "population": "63338", 
        "rank": "550", 
        "state": "California"
    }, 
    {
        "name": "New_Braunfels", 
        "growth_from_2000_to_2013": "64.0%", 
        "latitude": 29.7030024, 
        "longitude": -98.1244531, 
        "population": "63279", 
        "rank": "551", 
        "state": "Texas"
    }, 
    {
        "name": "Marysville", 
        "growth_from_2000_to_2013": "115.7%", 
        "latitude": 48.0517637, 
        "longitude": -122.1770818, 
        "population": "63269", 
        "rank": "552", 
        "state": "Washington"
    }, 
    {
        "name": "Tamarac", 
        "growth_from_2000_to_2013": "12.9%", 
        "latitude": 26.2128609, 
        "longitude": -80.2497707, 
        "population": "63155", 
        "rank": "553", 
        "state": "Florida"
    }, 
    {
        "name": "Madera", 
        "growth_from_2000_to_2013": "44.4%", 
        "latitude": 36.9613356, 
        "longitude": -120.0607176, 
        "population": "63105", 
        "rank": "554", 
        "state": "California"
    }, 
    {
        "name": "Conroe", 
        "growth_from_2000_to_2013": "61.9%", 
        "latitude": 30.3118769, 
        "longitude": -95.45605119999999, 
        "population": "63032", 
        "rank": "555", 
        "state": "Texas"
    }, 
    {
        "name": "Santa_Cruz", 
        "growth_from_2000_to_2013": "12.5%", 
        "latitude": 36.9741171, 
        "longitude": -122.0307963, 
        "population": "62864", 
        "rank": "556", 
        "state": "California"
    }, 
    {
        "name": "Eden_Prairie", 
        "growth_from_2000_to_2013": "13.3%", 
        "latitude": 44.8546856, 
        "longitude": -93.47078599999999, 
        "population": "62603", 
        "rank": "557", 
        "state": "Minnesota"
    }, 
    {
        "name": "Cheyenne", 
        "growth_from_2000_to_2013": "16.9%", 
        "latitude": 41.1399814, 
        "longitude": -104.8202462, 
        "population": "62448", 
        "rank": "558", 
        "state": "Wyoming"
    }, 
    {
        "name": "Daytona_Beach", 
        "growth_from_2000_to_2013": "-2.3%", 
        "latitude": 29.2108147, 
        "longitude": -81.0228331, 
        "population": "62316", 
        "rank": "559", 
        "state": "Florida"
    }, 
    {
        "name": "Alpharetta", 
        "growth_from_2000_to_2013": "33.6%", 
        "latitude": 34.0753762, 
        "longitude": -84.2940899, 
        "population": "62298", 
        "rank": "560", 
        "state": "Georgia"
    }, 
    {
        "name": "Hamilton", 
        "growth_from_2000_to_2013": "2.7%", 
        "latitude": 39.3995008, 
        "longitude": -84.5613355, 
        "population": "62258", 
        "rank": "561", 
        "state": "Ohio"
    }, 
    {
        "name": "Waltham", 
        "growth_from_2000_to_2013": "5.0%", 
        "latitude": 42.3764852, 
        "longitude": -71.2356113, 
        "population": "62227", 
        "rank": "562", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Coon_Rapids", 
        "growth_from_2000_to_2013": "0.6%", 
        "latitude": 45.1732394, 
        "longitude": -93.30300629999999, 
        "population": "62103", 
        "rank": "563", 
        "state": "Minnesota"
    }, 
    {
        "name": "Haverhill", 
        "growth_from_2000_to_2013": "5.0%", 
        "latitude": 42.7762015, 
        "longitude": -71.0772796, 
        "population": "62088", 
        "rank": "564", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Council_Bluffs", 
        "growth_from_2000_to_2013": "6.2%", 
        "latitude": 41.2619444, 
        "longitude": -95.8608333, 
        "population": "61969", 
        "rank": "565", 
        "state": "Iowa"
    }, 
    {
        "name": "Taylor", 
        "growth_from_2000_to_2013": "-6.3%", 
        "latitude": 42.240872, 
        "longitude": -83.2696509, 
        "population": "61817", 
        "rank": "566", 
        "state": "Michigan"
    }, 
    {
        "name": "Utica", 
        "growth_from_2000_to_2013": "2.2%", 
        "latitude": 43.100903, 
        "longitude": -75.232664, 
        "population": "61808", 
        "rank": "567", 
        "state": "New_York"
    }, 
    {
        "name": "Ames", 
        "growth_from_2000_to_2013": "21.3%", 
        "latitude": 42.034722, 
        "longitude": -93.61999999999999, 
        "population": "61792", 
        "rank": "568", 
        "state": "Iowa"
    }, 
    {
        "name": "La_Habra", 
        "growth_from_2000_to_2013": "3.6%", 
        "latitude": 33.9319578, 
        "longitude": -117.9461734, 
        "population": "61653", 
        "rank": "569", 
        "state": "California"
    }, 
    {
        "name": "Encinitas", 
        "growth_from_2000_to_2013": "5.8%", 
        "latitude": 33.0369867, 
        "longitude": -117.2919818, 
        "population": "61588", 
        "rank": "570", 
        "state": "California"
    }, 
    {
        "name": "Bowling_Green", 
        "growth_from_2000_to_2013": "24.1%", 
        "latitude": 36.9685219, 
        "longitude": -86.4808043, 
        "population": "61488", 
        "rank": "571", 
        "state": "Kentucky"
    }, 
    {
        "name": "Burnsville", 
        "growth_from_2000_to_2013": "1.9%", 
        "latitude": 44.7677424, 
        "longitude": -93.27772259999999, 
        "population": "61434", 
        "rank": "572", 
        "state": "Minnesota"
    }, 
    {
        "name": "Greenville", 
        "growth_from_2000_to_2013": "8.2%", 
        "latitude": 34.85261759999999, 
        "longitude": -82.3940104, 
        "population": "61397", 
        "rank": "573", 
        "state": "South_Carolina"
    }, 
    {
        "name": "West Des Moines", 
        "growth_from_2000_to_2013": "29.8%", 
        "latitude": 41.5772115, 
        "longitude": -93.711332, 
        "population": "61255", 
        "rank": "574", 
        "state": "Iowa"
    }, 
    {
        "name": "Cedar_Park", 
        "growth_from_2000_to_2013": "134.3%", 
        "latitude": 30.505198, 
        "longitude": -97.8202888, 
        "population": "61238", 
        "rank": "575", 
        "state": "Texas"
    }, 
    {
        "name": "Tulare", 
        "growth_from_2000_to_2013": "33.3%", 
        "latitude": 36.2077288, 
        "longitude": -119.3473379, 
        "population": "61170", 
        "rank": "576", 
        "state": "California"
    }, 
    {
        "name": "Monterey_Park", 
        "growth_from_2000_to_2013": "1.5%", 
        "latitude": 34.0625106, 
        "longitude": -118.1228476, 
        "population": "61085", 
        "rank": "577", 
        "state": "California"
    }, 
    {
        "name": "Vineland", 
        "growth_from_2000_to_2013": "9.3%", 
        "latitude": 39.4863773, 
        "longitude": -75.02596369999999, 
        "population": "61050", 
        "rank": "578", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Terre_Haute", 
        "growth_from_2000_to_2013": "2.5%", 
        "latitude": 39.4667034, 
        "longitude": -87.41390919999999, 
        "population": "61025", 
        "rank": "579", 
        "state": "Indiana"
    }, 
    {
        "name": "North_Miami", 
        "growth_from_2000_to_2013": "2.0%", 
        "latitude": 25.8900949, 
        "longitude": -80.1867138, 
        "population": "61007", 
        "rank": "580", 
        "state": "Florida"
    }, 
    {
        "name": "Mansfield", 
        "growth_from_2000_to_2013": "114.2%", 
        "latitude": 32.5631924, 
        "longitude": -97.1416768, 
        "population": "60872", 
        "rank": "581", 
        "state": "Texas"
    }, 
    {
        "name": "West_Allis", 
        "growth_from_2000_to_2013": "-0.6%", 
        "latitude": 43.0166806, 
        "longitude": -88.0070315, 
        "population": "60697", 
        "rank": "582", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Bristol", 
        "growth_from_2000_to_2013": "0.4%", 
        "latitude": 41.67176480000001, 
        "longitude": -72.9492703, 
        "population": "60568", 
        "rank": "583", 
        "state": "Connecticut"
    }, 
    {
        "name": "Taylorsville", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 40.66772479999999, 
        "longitude": -111.9388258, 
        "population": "60519", 
        "rank": "584", 
        "state": "Utah"
    }, 
    {
        "name": "Malden", 
        "growth_from_2000_to_2013": "7.4%", 
        "latitude": 42.4250964, 
        "longitude": -71.066163, 
        "population": "60509", 
        "rank": "585", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Meriden", 
        "growth_from_2000_to_2013": "3.7%", 
        "latitude": 41.5381535, 
        "longitude": -72.80704349999999, 
        "population": "60456", 
        "rank": "586", 
        "state": "Connecticut"
    }, 
    {
        "name": "Blaine", 
        "growth_from_2000_to_2013": "32.8%", 
        "latitude": 45.1607987, 
        "longitude": -93.23494889999999, 
        "population": "60407", 
        "rank": "587", 
        "state": "Minnesota"
    }, 
    {
        "name": "Wellington", 
        "growth_from_2000_to_2013": "55.0%", 
        "latitude": 26.6617635, 
        "longitude": -80.2683571, 
        "population": "60202", 
        "rank": "588", 
        "state": "Florida"
    }, 
    {
        "name": "Cupertino", 
        "growth_from_2000_to_2013": "14.3%", 
        "latitude": 37.3229978, 
        "longitude": -122.0321823, 
        "population": "60189", 
        "rank": "589", 
        "state": "California"
    }, 
    {
        "name": "Springfield", 
        "growth_from_2000_to_2013": "12.4%", 
        "latitude": 44.0462362, 
        "longitude": -123.0220289, 
        "population": "60177", 
        "rank": "590", 
        "state": "Oregon"
    }, 
    {
        "name": "Rogers", 
        "growth_from_2000_to_2013": "50.6%", 
        "latitude": 36.3320196, 
        "longitude": -94.1185366, 
        "population": "60112", 
        "rank": "591", 
        "state": "Arkansas"
    }, 
    {
        "name": "St. Clair Shores", 
        "growth_from_2000_to_2013": "-4.6%", 
        "latitude": 42.4974085, 
        "longitude": -82.89636039999999, 
        "population": "60070", 
        "rank": "592", 
        "state": "Michigan"
    }, 
    {
        "name": "Gardena", 
        "growth_from_2000_to_2013": "3.4%", 
        "latitude": 33.8883487, 
        "longitude": -118.3089624, 
        "population": "59957", 
        "rank": "593", 
        "state": "California"
    }, 
    {
        "name": "Pontiac", 
        "growth_from_2000_to_2013": "-11.4%", 
        "latitude": 42.6389216, 
        "longitude": -83.29104679999999, 
        "population": "59887", 
        "rank": "594", 
        "state": "Michigan"
    }, 
    {
        "name": "National_City", 
        "growth_from_2000_to_2013": "10.1%", 
        "latitude": 32.6781085, 
        "longitude": -117.0991967, 
        "population": "59834", 
        "rank": "595", 
        "state": "California"
    }, 
    {
        "name": "Grand_Junction", 
        "growth_from_2000_to_2013": "30.9%", 
        "latitude": 39.0638705, 
        "longitude": -108.5506486, 
        "population": "59778", 
        "rank": "596", 
        "state": "Colorado"
    }, 
    {
        "name": "Rocklin", 
        "growth_from_2000_to_2013": "60.3%", 
        "latitude": 38.7907339, 
        "longitude": -121.2357828, 
        "population": "59738", 
        "rank": "597", 
        "state": "California"
    }, 
    {
        "name": "Chapel_Hill", 
        "growth_from_2000_to_2013": "24.1%", 
        "latitude": 35.9131996, 
        "longitude": -79.0558445, 
        "population": "59635", 
        "rank": "598", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Casper", 
        "growth_from_2000_to_2013": "19.9%", 
        "latitude": 42.866632, 
        "longitude": -106.313081, 
        "population": "59628", 
        "rank": "599", 
        "state": "Wyoming"
    }, 
    {
        "name": "Broomfield", 
        "growth_from_2000_to_2013": "50.3%", 
        "latitude": 39.9205411, 
        "longitude": -105.0866504, 
        "population": "59471", 
        "rank": "600", 
        "state": "Colorado"
    }, 
    {
        "name": "Petaluma", 
        "growth_from_2000_to_2013": "8.4%", 
        "latitude": 38.232417, 
        "longitude": -122.6366524, 
        "population": "59440", 
        "rank": "601", 
        "state": "California"
    }, 
    {
        "name": "South_Jordan", 
        "growth_from_2000_to_2013": "100.1%", 
        "latitude": 40.5621704, 
        "longitude": -111.929658, 
        "population": "59366", 
        "rank": "602", 
        "state": "Utah"
    }, 
    {
        "name": "Springfield", 
        "growth_from_2000_to_2013": "-9.8%", 
        "latitude": 39.9242266, 
        "longitude": -83.8088171, 
        "population": "59357", 
        "rank": "603", 
        "state": "Ohio"
    }, 
    {
        "name": "Great_Falls", 
        "growth_from_2000_to_2013": "3.9%", 
        "latitude": 47.4941836, 
        "longitude": -111.2833449, 
        "population": "59351", 
        "rank": "604", 
        "state": "Montana"
    }, 
    {
        "name": "Lancaster", 
        "growth_from_2000_to_2013": "4.5%", 
        "latitude": 40.0378755, 
        "longitude": -76.3055144, 
        "population": "59325", 
        "rank": "605", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "North_Port", 
        "growth_from_2000_to_2013": "154.6%", 
        "latitude": 27.044224, 
        "longitude": -82.2359254, 
        "population": "59212", 
        "rank": "606", 
        "state": "Florida"
    }, 
    {
        "name": "Lakewood", 
        "growth_from_2000_to_2013": "1.1%", 
        "latitude": 47.1717649, 
        "longitude": -122.518458, 
        "population": "59097", 
        "rank": "607", 
        "state": "Washington"
    }, 
    {
        "name": "Marietta", 
        "growth_from_2000_to_2013": "-3.8%", 
        "latitude": 33.95260200000001, 
        "longitude": -84.5499327, 
        "population": "59089", 
        "rank": "608", 
        "state": "Georgia"
    }, 
    {
        "name": "San_Rafael", 
        "growth_from_2000_to_2013": "5.0%", 
        "latitude": 37.9735346, 
        "longitude": -122.5310874, 
        "population": "58994", 
        "rank": "609", 
        "state": "California"
    }, 
    {
        "name": "Royal_Oak", 
        "growth_from_2000_to_2013": "-1.7%", 
        "latitude": 42.4894801, 
        "longitude": -83.1446485, 
        "population": "58946", 
        "rank": "610", 
        "state": "Michigan"
    }, 
    {
        "name": "Des_Plaines", 
        "growth_from_2000_to_2013": "3.2%", 
        "latitude": 42.0333623, 
        "longitude": -87.88339909999999, 
        "population": "58918", 
        "rank": "611", 
        "state": "Illinois"
    }, 
    {
        "name": "Huntington_Park", 
        "growth_from_2000_to_2013": "-4.1%", 
        "latitude": 33.9816812, 
        "longitude": -118.2250725, 
        "population": "58879", 
        "rank": "612", 
        "state": "California"
    }, 
    {
        "name": "La_Mesa", 
        "growth_from_2000_to_2013": "6.9%", 
        "latitude": 32.7678287, 
        "longitude": -117.0230839, 
        "population": "58642", 
        "rank": "613", 
        "state": "California"
    }, 
    {
        "name": "Orland_Park", 
        "growth_from_2000_to_2013": "13.9%", 
        "latitude": 41.6303103, 
        "longitude": -87.85394250000002, 
        "population": "58590", 
        "rank": "614", 
        "state": "Illinois"
    }, 
    {
        "name": "Auburn", 
        "growth_from_2000_to_2013": "26.4%", 
        "latitude": 32.6098566, 
        "longitude": -85.48078249999999, 
        "population": "58582", 
        "rank": "615", 
        "state": "Alabama"
    }, 
    {
        "name": "Lakeville", 
        "growth_from_2000_to_2013": "34.3%", 
        "latitude": 44.6496868, 
        "longitude": -93.24271999999999, 
        "population": "58562", 
        "rank": "616", 
        "state": "Minnesota"
    }, 
    {
        "name": "Owensboro", 
        "growth_from_2000_to_2013": "7.7%", 
        "latitude": 37.7719074, 
        "longitude": -87.1111676, 
        "population": "58416", 
        "rank": "617", 
        "state": "Kentucky"
    }, 
    {
        "name": "Moore", 
        "growth_from_2000_to_2013": "41.5%", 
        "latitude": 35.3395079, 
        "longitude": -97.48670279999999, 
        "population": "58414", 
        "rank": "618", 
        "state": "Oklahoma"
    }, 
    {
        "name": "Jupiter", 
        "growth_from_2000_to_2013": "46.2%", 
        "latitude": 26.9342246, 
        "longitude": -80.0942087, 
        "population": "58298", 
        "rank": "619", 
        "state": "Florida"
    }, 
    {
        "name": "Idaho_Falls", 
        "growth_from_2000_to_2013": "14.0%", 
        "latitude": 43.49165139999999, 
        "longitude": -112.0339645, 
        "population": "58292", 
        "rank": "620", 
        "state": "Idaho"
    }, 
    {
        "name": "Dubuque", 
        "growth_from_2000_to_2013": "0.9%", 
        "latitude": 42.5005583, 
        "longitude": -90.66457179999999, 
        "population": "58253", 
        "rank": "621", 
        "state": "Iowa"
    }, 
    {
        "name": "Bartlett", 
        "growth_from_2000_to_2013": "31.7%", 
        "latitude": 35.2045328, 
        "longitude": -89.8739753, 
        "population": "58226", 
        "rank": "622", 
        "state": "Tennessee"
    }, 
    {
        "name": "Rowlett", 
        "growth_from_2000_to_2013": "28.6%", 
        "latitude": 32.9029017, 
        "longitude": -96.56388, 
        "population": "58043", 
        "rank": "623", 
        "state": "Texas"
    }, 
    {
        "name": "Novi", 
        "growth_from_2000_to_2013": "22.0%", 
        "latitude": 42.48059, 
        "longitude": -83.4754913, 
        "population": "57960", 
        "rank": "624", 
        "state": "Michigan"
    }, 
    {
        "name": "White_Plains", 
        "growth_from_2000_to_2013": "8.5%", 
        "latitude": 41.03398620000001, 
        "longitude": -73.7629097, 
        "population": "57866", 
        "rank": "625", 
        "state": "New_York"
    }, 
    {
        "name": "Arcadia", 
        "growth_from_2000_to_2013": "8.3%", 
        "latitude": 34.1397292, 
        "longitude": -118.0353449, 
        "population": "57639", 
        "rank": "626", 
        "state": "California"
    }, 
    {
        "name": "Redmond", 
        "growth_from_2000_to_2013": "26.0%", 
        "latitude": 47.6739881, 
        "longitude": -122.121512, 
        "population": "57530", 
        "rank": "627", 
        "state": "Washington"
    }, 
    {
        "name": "Lake_Elsinore", 
        "growth_from_2000_to_2013": "96.5%", 
        "latitude": 33.6680772, 
        "longitude": -117.3272615, 
        "population": "57525", 
        "rank": "628", 
        "state": "California"
    }, 
    {
        "name": "Ocala", 
        "growth_from_2000_to_2013": "20.8%", 
        "latitude": 29.1871986, 
        "longitude": -82.14009229999999, 
        "population": "57468", 
        "rank": "629", 
        "state": "Florida"
    }, 
    {
        "name": "Tinley_Park", 
        "growth_from_2000_to_2013": "16.3%", 
        "latitude": 41.5731442, 
        "longitude": -87.7932939, 
        "population": "57282", 
        "rank": "630", 
        "state": "Illinois"
    }, 
    {
        "name": "Port_Orange", 
        "growth_from_2000_to_2013": "22.8%", 
        "latitude": 29.1383165, 
        "longitude": -80.9956105, 
        "population": "57203", 
        "rank": "631", 
        "state": "Florida"
    }, 
    {
        "name": "Medford", 
        "growth_from_2000_to_2013": "2.7%", 
        "latitude": 42.4184296, 
        "longitude": -71.1061639, 
        "population": "57170", 
        "rank": "632", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Oak_Lawn", 
        "growth_from_2000_to_2013": "3.3%", 
        "latitude": 41.719978, 
        "longitude": -87.7479528, 
        "population": "57073", 
        "rank": "633", 
        "state": "Illinois"
    }, 
    {
        "name": "Rocky_Mount", 
        "growth_from_2000_to_2013": "-3.1%", 
        "latitude": 35.9382103, 
        "longitude": -77.7905339, 
        "population": "56954", 
        "rank": "634", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Kokomo", 
        "growth_from_2000_to_2013": "21.3%", 
        "latitude": 40.486427, 
        "longitude": -86.13360329999999, 
        "population": "56895", 
        "rank": "635", 
        "state": "Indiana"
    }, 
    {
        "name": "Coconut_Creek", 
        "growth_from_2000_to_2013": "28.4%", 
        "latitude": 26.2517482, 
        "longitude": -80.17893509999999, 
        "population": "56792", 
        "rank": "636", 
        "state": "Florida"
    }, 
    {
        "name": "Bowie", 
        "growth_from_2000_to_2013": "8.6%", 
        "latitude": 39.0067768, 
        "longitude": -76.77913649999999, 
        "population": "56759", 
        "rank": "637", 
        "state": "Maryland"
    }, 
    {
        "name": "Berwyn", 
        "growth_from_2000_to_2013": "5.1%", 
        "latitude": 41.85058739999999, 
        "longitude": -87.7936685, 
        "population": "56758", 
        "rank": "638", 
        "state": "Illinois"
    }, 
    {
        "name": "Midwest_City", 
        "growth_from_2000_to_2013": "4.5%", 
        "latitude": 35.4495065, 
        "longitude": -97.3967019, 
        "population": "56756", 
        "rank": "639", 
        "state": "Oklahoma"
    }, 
    {
        "name": "Fountain_Valley", 
        "growth_from_2000_to_2013": "3.0%", 
        "latitude": 33.7091847, 
        "longitude": -117.9536697, 
        "population": "56707", 
        "rank": "640", 
        "state": "California"
    }, 
    {
        "name": "Buckeye", 
        "growth_from_2000_to_2013": "480.9%", 
        "latitude": 33.3703197, 
        "longitude": -112.5837766, 
        "population": "56683", 
        "rank": "641", 
        "state": "Arizona"
    }, 
    {
        "name": "Dearborn_Heights", 
        "growth_from_2000_to_2013": "-3.0%", 
        "latitude": 42.3369816, 
        "longitude": -83.27326269999999, 
        "population": "56620", 
        "rank": "642", 
        "state": "Michigan"
    }, 
    {
        "name": "Woodland", 
        "growth_from_2000_to_2013": "13.8%", 
        "latitude": 38.67851570000001, 
        "longitude": -121.7732971, 
        "population": "56590", 
        "rank": "643", 
        "state": "California"
    }, 
    {
        "name": "Noblesville", 
        "growth_from_2000_to_2013": "88.1%", 
        "latitude": 40.0455917, 
        "longitude": -86.0085955, 
        "population": "56540", 
        "rank": "644", 
        "state": "Indiana"
    }, 
    {
        "name": "Valdosta", 
        "growth_from_2000_to_2013": "22.3%", 
        "latitude": 30.8327022, 
        "longitude": -83.2784851, 
        "population": "56481", 
        "rank": "645", 
        "state": "Georgia"
    }, 
    {
        "name": "Diamond_Bar", 
        "growth_from_2000_to_2013": "0.1%", 
        "latitude": 34.0286226, 
        "longitude": -117.8103367, 
        "population": "56449", 
        "rank": "646", 
        "state": "California"
    }, 
    {
        "name": "Manhattan", 
        "growth_from_2000_to_2013": "22.8%", 
        "latitude": 39.18360819999999, 
        "longitude": -96.57166939999999, 
        "population": "56143", 
        "rank": "647", 
        "state": "Kansas"
    }, 
    {
        "name": "Santee", 
        "growth_from_2000_to_2013": "5.7%", 
        "latitude": 32.8383828, 
        "longitude": -116.9739167, 
        "population": "56105", 
        "rank": "648", 
        "state": "California"
    }, 
    {
        "name": "Taunton", 
        "growth_from_2000_to_2013": "0.0%", 
        "latitude": 41.900101, 
        "longitude": -71.0897674, 
        "population": "56069", 
        "rank": "649", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Sanford", 
        "growth_from_2000_to_2013": "42.8%", 
        "latitude": 28.8028612, 
        "longitude": -81.269453, 
        "population": "56002", 
        "rank": "650", 
        "state": "Florida"
    }, 
    {
        "name": "Kettering", 
        "growth_from_2000_to_2013": "-3.1%", 
        "latitude": 39.68950359999999, 
        "longitude": -84.1688274, 
        "population": "55870", 
        "rank": "651", 
        "state": "Ohio"
    }, 
    {
        "name": "New_Brunswick", 
        "growth_from_2000_to_2013": "15.5%", 
        "latitude": 40.4862157, 
        "longitude": -74.4518188, 
        "population": "55831", 
        "rank": "652", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Decatur", 
        "growth_from_2000_to_2013": "3.1%", 
        "latitude": 34.6059253, 
        "longitude": -86.9833417, 
        "population": "55816", 
        "rank": "653", 
        "state": "Alabama"
    }, 
    {
        "name": "Chicopee", 
        "growth_from_2000_to_2013": "1.7%", 
        "latitude": 42.1487043, 
        "longitude": -72.6078672, 
        "population": "55717", 
        "rank": "654", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Anderson", 
        "growth_from_2000_to_2013": "-6.6%", 
        "latitude": 40.1053196, 
        "longitude": -85.6802541, 
        "population": "55670", 
        "rank": "655", 
        "state": "Indiana"
    }, 
    {
        "name": "Margate", 
        "growth_from_2000_to_2013": "2.7%", 
        "latitude": 26.2445263, 
        "longitude": -80.206436, 
        "population": "55456", 
        "rank": "656", 
        "state": "Florida"
    }, 
    {
        "name": "Weymouth_Town", 
        "growth_from_2000_to_2013": "", 
        "latitude": 42.2180724, 
        "longitude": -70.94103559999999, 
        "population": "55419", 
        "rank": "657", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Hempstead", 
        "growth_from_2000_to_2013": "4.0%", 
        "latitude": 40.7062128, 
        "longitude": -73.6187397, 
        "population": "55361", 
        "rank": "658", 
        "state": "New_York"
    }, 
    {
        "name": "Corvallis", 
        "growth_from_2000_to_2013": "11.8%", 
        "latitude": 44.5645659, 
        "longitude": -123.2620435, 
        "population": "55298", 
        "rank": "659", 
        "state": "Oregon"
    }, 
    {
        "name": "Eastvale", 
        "growth_from_2000_to_2013": "", 
        "latitude": 33.952463, 
        "longitude": -117.5848025, 
        "population": "55191", 
        "rank": "660", 
        "state": "California"
    }, 
    {
        "name": "Porterville", 
        "growth_from_2000_to_2013": "20.1%", 
        "latitude": 36.06523, 
        "longitude": -119.0167679, 
        "population": "55174", 
        "rank": "661", 
        "state": "California"
    }, 
    {
        "name": "West_Haven", 
        "growth_from_2000_to_2013": "5.1%", 
        "latitude": 41.2705484, 
        "longitude": -72.9469711, 
        "population": "55046", 
        "rank": "662", 
        "state": "Connecticut"
    }, 
    {
        "name": "Brentwood", 
        "growth_from_2000_to_2013": "122.3%", 
        "latitude": 37.931868, 
        "longitude": -121.6957863, 
        "population": "55000", 
        "rank": "663", 
        "state": "California"
    }, 
    {
        "name": "Paramount", 
        "growth_from_2000_to_2013": "-0.7%", 
        "latitude": 33.8894598, 
        "longitude": -118.1597911, 
        "population": "54980", 
        "rank": "664", 
        "state": "California"
    }, 
    {
        "name": "Grand_Forks", 
        "growth_from_2000_to_2013": "11.5%", 
        "latitude": 47.9252568, 
        "longitude": -97.0328547, 
        "population": "54932", 
        "rank": "665", 
        "state": "North_Dakota"
    }, 
    {
        "name": "Georgetown", 
        "growth_from_2000_to_2013": "91.9%", 
        "latitude": 30.6332618, 
        "longitude": -97.6779842, 
        "population": "54898", 
        "rank": "666", 
        "state": "Texas"
    }, 
    {
        "name": "St. Peters", 
        "growth_from_2000_to_2013": "6.5%", 
        "latitude": 38.7874699, 
        "longitude": -90.6298922, 
        "population": "54842", 
        "rank": "667", 
        "state": "Missouri"
    }, 
    {
        "name": "Shoreline", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 47.7556531, 
        "longitude": -122.3415178, 
        "population": "54790", 
        "rank": "668", 
        "state": "Washington"
    }, 
    {
        "name": "Mount_Prospect", 
        "growth_from_2000_to_2013": "-2.5%", 
        "latitude": 42.0664167, 
        "longitude": -87.9372908, 
        "population": "54771", 
        "rank": "669", 
        "state": "Illinois"
    }, 
    {
        "name": "Hanford", 
        "growth_from_2000_to_2013": "30.3%", 
        "latitude": 36.3274502, 
        "longitude": -119.6456844, 
        "population": "54686", 
        "rank": "670", 
        "state": "California"
    }, 
    {
        "name": "Normal", 
        "growth_from_2000_to_2013": "19.7%", 
        "latitude": 40.5142026, 
        "longitude": -88.9906312, 
        "population": "54664", 
        "rank": "671", 
        "state": "Illinois"
    }, 
    {
        "name": "Rosemead", 
        "growth_from_2000_to_2013": "1.7%", 
        "latitude": 34.0805651, 
        "longitude": -118.072846, 
        "population": "54561", 
        "rank": "672", 
        "state": "California"
    }, 
    {
        "name": "Lehi", 
        "growth_from_2000_to_2013": "176.3%", 
        "latitude": 40.3916172, 
        "longitude": -111.8507662, 
        "population": "54382", 
        "rank": "673", 
        "state": "Utah"
    }, 
    {
        "name": "Pocatello", 
        "growth_from_2000_to_2013": "5.4%", 
        "latitude": 42.8713032, 
        "longitude": -112.4455344, 
        "population": "54350", 
        "rank": "674", 
        "state": "Idaho"
    }, 
    {
        "name": "Highland", 
        "growth_from_2000_to_2013": "21.0%", 
        "latitude": 34.1283442, 
        "longitude": -117.2086513, 
        "population": "54291", 
        "rank": "675", 
        "state": "California"
    }, 
    {
        "name": "Novato", 
        "growth_from_2000_to_2013": "13.3%", 
        "latitude": 38.1074198, 
        "longitude": -122.5697032, 
        "population": "54194", 
        "rank": "676", 
        "state": "California"
    }, 
    {
        "name": "Port_Arthur", 
        "growth_from_2000_to_2013": "-6.0%", 
        "latitude": 29.8849504, 
        "longitude": -93.93994699999999, 
        "population": "54135", 
        "rank": "677", 
        "state": "Texas"
    }, 
    {
        "name": "Carson_City", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 39.1637984, 
        "longitude": -119.7674034, 
        "population": "54080", 
        "rank": "678", 
        "state": "Nevada"
    }, 
    {
        "name": "San_Marcos", 
        "growth_from_2000_to_2013": "48.5%", 
        "latitude": 29.8832749, 
        "longitude": -97.9413941, 
        "population": "54076", 
        "rank": "679", 
        "state": "Texas"
    }, 
    {
        "name": "Hendersonville", 
        "growth_from_2000_to_2013": "31.7%", 
        "latitude": 36.3047735, 
        "longitude": -86.6199957, 
        "population": "54068", 
        "rank": "680", 
        "state": "Tennessee"
    }, 
    {
        "name": "Elyria", 
        "growth_from_2000_to_2013": "-3.7%", 
        "latitude": 41.3683798, 
        "longitude": -82.10764859999999, 
        "population": "53956", 
        "rank": "681", 
        "state": "Ohio"
    }, 
    {
        "name": "Revere", 
        "growth_from_2000_to_2013": "13.4%", 
        "latitude": 42.4084302, 
        "longitude": -71.0119948, 
        "population": "53756", 
        "rank": "682", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Pflugerville", 
        "growth_from_2000_to_2013": "123.4%", 
        "latitude": 30.4393696, 
        "longitude": -97.62000429999999, 
        "population": "53752", 
        "rank": "683", 
        "state": "Texas"
    }, 
    {
        "name": "Greenwood", 
        "growth_from_2000_to_2013": "46.0%", 
        "latitude": 39.6136578, 
        "longitude": -86.10665259999999, 
        "population": "53665", 
        "rank": "684", 
        "state": "Indiana"
    }, 
    {
        "name": "Bellevue", 
        "growth_from_2000_to_2013": "20.5%", 
        "latitude": 41.1543623, 
        "longitude": -95.9145568, 
        "population": "53663", 
        "rank": "685", 
        "state": "Nebraska"
    }, 
    {
        "name": "Wheaton", 
        "growth_from_2000_to_2013": "-3.4%", 
        "latitude": 41.8661403, 
        "longitude": -88.1070127, 
        "population": "53648", 
        "rank": "686", 
        "state": "Illinois"
    }, 
    {
        "name": "Smyrna", 
        "growth_from_2000_to_2013": "20.0%", 
        "latitude": 33.8839926, 
        "longitude": -84.51437609999999, 
        "population": "53438", 
        "rank": "687", 
        "state": "Georgia"
    }, 
    {
        "name": "Sarasota", 
        "growth_from_2000_to_2013": "1.4%", 
        "latitude": 27.3364347, 
        "longitude": -82.53065269999999, 
        "population": "53326", 
        "rank": "688", 
        "state": "Florida"
    }, 
    {
        "name": "Blue_Springs", 
        "growth_from_2000_to_2013": "9.9%", 
        "latitude": 39.0169509, 
        "longitude": -94.2816148, 
        "population": "53294", 
        "rank": "689", 
        "state": "Missouri"
    }, 
    {
        "name": "Colton", 
        "growth_from_2000_to_2013": "10.8%", 
        "latitude": 34.0739016, 
        "longitude": -117.3136547, 
        "population": "53243", 
        "rank": "690", 
        "state": "California"
    }, 
    {
        "name": "Euless", 
        "growth_from_2000_to_2013": "15.1%", 
        "latitude": 32.8370727, 
        "longitude": -97.08195409999999, 
        "population": "53224", 
        "rank": "691", 
        "state": "Texas"
    }, 
    {
        "name": "Castle_Rock", 
        "growth_from_2000_to_2013": "153.5%", 
        "latitude": 39.3722121, 
        "longitude": -104.8560902, 
        "population": "53063", 
        "rank": "692", 
        "state": "Colorado"
    }, 
    {
        "name": "Cathedral_City", 
        "growth_from_2000_to_2013": "23.2%", 
        "latitude": 33.7805388, 
        "longitude": -116.4668036, 
        "population": "52977", 
        "rank": "693", 
        "state": "California"
    }, 
    {
        "name": "Kingsport", 
        "growth_from_2000_to_2013": "16.7%", 
        "latitude": 36.548434, 
        "longitude": -82.5618186, 
        "population": "52962", 
        "rank": "694", 
        "state": "Tennessee"
    }, 
    {
        "name": "Lake Havasu City", 
        "growth_from_2000_to_2013": "24.6%", 
        "latitude": 34.483901, 
        "longitude": -114.3224548, 
        "population": "52844", 
        "rank": "695", 
        "state": "Arizona"
    }, 
    {
        "name": "Pensacola", 
        "growth_from_2000_to_2013": "-6.0%", 
        "latitude": 30.42130899999999, 
        "longitude": -87.2169149, 
        "population": "52703", 
        "rank": "696", 
        "state": "Florida"
    }, 
    {
        "name": "Hoboken", 
        "growth_from_2000_to_2013": "35.8%", 
        "latitude": 40.7439905, 
        "longitude": -74.0323626, 
        "population": "52575", 
        "rank": "697", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Yucaipa", 
        "growth_from_2000_to_2013": "26.8%", 
        "latitude": 34.033625, 
        "longitude": -117.0430865, 
        "population": "52536", 
        "rank": "698", 
        "state": "California"
    }, 
    {
        "name": "Watsonville", 
        "growth_from_2000_to_2013": "12.7%", 
        "latitude": 36.910231, 
        "longitude": -121.7568946, 
        "population": "52477", 
        "rank": "699", 
        "state": "California"
    }, 
    {
        "name": "Richland", 
        "growth_from_2000_to_2013": "34.6%", 
        "latitude": 46.2856907, 
        "longitude": -119.2844621, 
        "population": "52413", 
        "rank": "700", 
        "state": "Washington"
    }, 
    {
        "name": "Delano", 
        "growth_from_2000_to_2013": "31.8%", 
        "latitude": 35.7688425, 
        "longitude": -119.2470536, 
        "population": "52403", 
        "rank": "701", 
        "state": "California"
    }, 
    {
        "name": "Hoffman_Estates", 
        "growth_from_2000_to_2013": "5.4%", 
        "latitude": 42.0629915, 
        "longitude": -88.12271989999999, 
        "population": "52398", 
        "rank": "702", 
        "state": "Illinois"
    }, 
    {
        "name": "Florissant", 
        "growth_from_2000_to_2013": "-2.8%", 
        "latitude": 38.789217, 
        "longitude": -90.322614, 
        "population": "52363", 
        "rank": "703", 
        "state": "Missouri"
    }, 
    {
        "name": "Placentia", 
        "growth_from_2000_to_2013": "11.8%", 
        "latitude": 33.8722371, 
        "longitude": -117.8703363, 
        "population": "52206", 
        "rank": "704", 
        "state": "California"
    }, 
    {
        "name": "West New York", 
        "growth_from_2000_to_2013": "13.3%", 
        "latitude": 40.7878788, 
        "longitude": -74.0143064, 
        "population": "52122", 
        "rank": "705", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Dublin", 
        "growth_from_2000_to_2013": "70.0%", 
        "latitude": 37.7021521, 
        "longitude": -121.9357918, 
        "population": "52105", 
        "rank": "706", 
        "state": "California"
    }, 
    {
        "name": "Oak_Park", 
        "growth_from_2000_to_2013": "-0.8%", 
        "latitude": 41.8850317, 
        "longitude": -87.7845025, 
        "population": "52066", 
        "rank": "707", 
        "state": "Illinois"
    }, 
    {
        "name": "Peabody", 
        "growth_from_2000_to_2013": "7.5%", 
        "latitude": 42.5278731, 
        "longitude": -70.9286609, 
        "population": "52044", 
        "rank": "708", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Perth_Amboy", 
        "growth_from_2000_to_2013": "9.7%", 
        "latitude": 40.5067723, 
        "longitude": -74.2654234, 
        "population": "51982", 
        "rank": "709", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Battle_Creek", 
        "growth_from_2000_to_2013": "-2.8%", 
        "latitude": 42.3211522, 
        "longitude": -85.17971419999999, 
        "population": "51848", 
        "rank": "710", 
        "state": "Michigan"
    }, 
    {
        "name": "Bradenton", 
        "growth_from_2000_to_2013": "3.4%", 
        "latitude": 27.4989278, 
        "longitude": -82.5748194, 
        "population": "51763", 
        "rank": "711", 
        "state": "Florida"
    }, 
    {
        "name": "Gilroy", 
        "growth_from_2000_to_2013": "23.9%", 
        "latitude": 37.0057816, 
        "longitude": -121.5682751, 
        "population": "51701", 
        "rank": "712", 
        "state": "California"
    }, 
    {
        "name": "Milford", 
        "growth_from_2000_to_2013": "1.8%", 
        "latitude": 41.2306979, 
        "longitude": -73.064036, 
        "population": "51644", 
        "rank": "713", 
        "state": "Connecticut"
    }, 
    {
        "name": "Albany", 
        "growth_from_2000_to_2013": "25.5%", 
        "latitude": 44.6365107, 
        "longitude": -123.1059282, 
        "population": "51583", 
        "rank": "714", 
        "state": "Oregon"
    }, 
    {
        "name": "Ankeny", 
        "growth_from_2000_to_2013": "86.9%", 
        "latitude": 41.7317884, 
        "longitude": -93.6001278, 
        "population": "51567", 
        "rank": "715", 
        "state": "Iowa"
    }, 
    {
        "name": "La_Crosse", 
        "growth_from_2000_to_2013": "-0.8%", 
        "latitude": 43.8013556, 
        "longitude": -91.23958069999999, 
        "population": "51522", 
        "rank": "716", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Burlington", 
        "growth_from_2000_to_2013": "12.1%", 
        "latitude": 36.0956918, 
        "longitude": -79.43779909999999, 
        "population": "51510", 
        "rank": "717", 
        "state": "North_Carolina"
    }, 
    {
        "name": "DeSoto", 
        "growth_from_2000_to_2013": "36.0%", 
        "latitude": 32.5896998, 
        "longitude": -96.8570738, 
        "population": "51483", 
        "rank": "718", 
        "state": "Texas"
    }, 
    {
        "name": "Harrisonburg", 
        "growth_from_2000_to_2013": "27.1%", 
        "latitude": 38.4495688, 
        "longitude": -78.8689155, 
        "population": "51395", 
        "rank": "719", 
        "state": "Virginia"
    }, 
    {
        "name": "Minnetonka", 
        "growth_from_2000_to_2013": "0.4%", 
        "latitude": 44.9211836, 
        "longitude": -93.4687489, 
        "population": "51368", 
        "rank": "720", 
        "state": "Minnesota"
    }, 
    {
        "name": "Elkhart", 
        "growth_from_2000_to_2013": "-2.5%", 
        "latitude": 41.6819935, 
        "longitude": -85.9766671, 
        "population": "51265", 
        "rank": "721", 
        "state": "Indiana"
    }, 
    {
        "name": "Lakewood", 
        "growth_from_2000_to_2013": "-9.4%", 
        "latitude": 41.4819932, 
        "longitude": -81.7981908, 
        "population": "51143", 
        "rank": "722", 
        "state": "Ohio"
    }, 
    {
        "name": "Glendora", 
        "growth_from_2000_to_2013": "3.1%", 
        "latitude": 34.1361187, 
        "longitude": -117.865339, 
        "population": "51074", 
        "rank": "723", 
        "state": "California"
    }, 
    {
        "name": "Southaven", 
        "growth_from_2000_to_2013": "72.8%", 
        "latitude": 34.9889818, 
        "longitude": -90.0125913, 
        "population": "50997", 
        "rank": "724", 
        "state": "Mississippi"
    }, 
    {
        "name": "Charleston", 
        "growth_from_2000_to_2013": "-4.7%", 
        "latitude": 38.3498195, 
        "longitude": -81.6326234, 
        "population": "50821", 
        "rank": "725", 
        "state": "West_Virginia"
    }, 
    {
        "name": "Joplin", 
        "growth_from_2000_to_2013": "11.2%", 
        "latitude": 37.08422710000001, 
        "longitude": -94.51328099999999, 
        "population": "50789", 
        "rank": "726", 
        "state": "Missouri"
    }, 
    {
        "name": "Enid", 
        "growth_from_2000_to_2013": "8.1%", 
        "latitude": 36.3955891, 
        "longitude": -97.8783911, 
        "population": "50725", 
        "rank": "727", 
        "state": "Oklahoma"
    }, 
    {
        "name": "Palm Beach Gardens", 
        "growth_from_2000_to_2013": "39.6%", 
        "latitude": 26.8233946, 
        "longitude": -80.13865469999999, 
        "population": "50699", 
        "rank": "728", 
        "state": "Florida"
    }, 
    {
        "name": "Brookhaven", 
        "growth_from_2000_to_2013": "", 
        "latitude": 33.8651033, 
        "longitude": -84.3365917, 
        "population": "50603", 
        "rank": "729", 
        "state": "Georgia"
    }, 
    {
        "name": "Plainfield", 
        "growth_from_2000_to_2013": "5.7%", 
        "latitude": 40.6337136, 
        "longitude": -74.4073736, 
        "population": "50588", 
        "rank": "730", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Grand_Island", 
        "growth_from_2000_to_2013": "16.0%", 
        "latitude": 40.9263957, 
        "longitude": -98.3420118, 
        "population": "50550", 
        "rank": "731", 
        "state": "Nebraska"
    }, 
    {
        "name": "Palm_Desert", 
        "growth_from_2000_to_2013": "13.2%", 
        "latitude": 33.7222445, 
        "longitude": -116.3744556, 
        "population": "50508", 
        "rank": "732", 
        "state": "California"
    }, 
    {
        "name": "Huntersville", 
        "growth_from_2000_to_2013": "92.9%", 
        "latitude": 35.410694, 
        "longitude": -80.84285040000002, 
        "population": "50458", 
        "rank": "733", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Tigard", 
        "growth_from_2000_to_2013": "17.8%", 
        "latitude": 45.4312294, 
        "longitude": -122.7714861, 
        "population": "50444", 
        "rank": "734", 
        "state": "Oregon"
    }, 
    {
        "name": "Lenexa", 
        "growth_from_2000_to_2013": "24.6%", 
        "latitude": 38.9536174, 
        "longitude": -94.73357089999999, 
        "population": "50344", 
        "rank": "735", 
        "state": "Kansas"
    }, 
    {
        "name": "Saginaw", 
        "growth_from_2000_to_2013": "-18.2%", 
        "latitude": 43.4194699, 
        "longitude": -83.9508068, 
        "population": "50303", 
        "rank": "736", 
        "state": "Michigan"
    }, 
    {
        "name": "Kentwood", 
        "growth_from_2000_to_2013": "10.5%", 
        "latitude": 42.8694731, 
        "longitude": -85.64474919999999, 
        "population": "50233", 
        "rank": "737", 
        "state": "Michigan"
    }, 
    {
        "name": "Doral", 
        "growth_from_2000_to_2013": "137.6%", 
        "latitude": 25.8195424, 
        "longitude": -80.3553302, 
        "population": "50213", 
        "rank": "738", 
        "state": "Florida"
    }, 
    {
        "name": "Apple_Valley", 
        "growth_from_2000_to_2013": "9.2%", 
        "latitude": 44.7319094, 
        "longitude": -93.21772000000001, 
        "population": "50201", 
        "rank": "739", 
        "state": "Minnesota"
    }, 
    {
        "name": "Grapevine", 
        "growth_from_2000_to_2013": "17.6%", 
        "latitude": 32.9342919, 
        "longitude": -97.0780654, 
        "population": "50195", 
        "rank": "740", 
        "state": "Texas"
    }, 
    {
        "name": "Aliso_Viejo", 
        "growth_from_2000_to_2013": "25.4%", 
        "latitude": 33.5676842, 
        "longitude": -117.7256083, 
        "population": "50175", 
        "rank": "741", 
        "state": "California"
    }, 
    {
        "name": "Sammamish", 
        "growth_from_2000_to_2013": "44.1%", 
        "latitude": 47.61626829999999, 
        "longitude": -122.0355736, 
        "population": "50169", 
        "rank": "742", 
        "state": "Washington"
    }, 
    {
        "name": "Casa_Grande", 
        "growth_from_2000_to_2013": "86.0%", 
        "latitude": 32.8795022, 
        "longitude": -111.7573521, 
        "population": "50111", 
        "rank": "743", 
        "state": "Arizona"
    }, 
    {
        "name": "Pinellas_Park", 
        "growth_from_2000_to_2013": "5.9%", 
        "latitude": 27.8428025, 
        "longitude": -82.6995443, 
        "population": "49998", 
        "rank": "744", 
        "state": "Florida"
    }, 
    {
        "name": "Troy", 
        "growth_from_2000_to_2013": "1.5%", 
        "latitude": 42.7284117, 
        "longitude": -73.69178509999999, 
        "population": "49974", 
        "rank": "745", 
        "state": "New_York"
    }, 
    {
        "name": "West_Sacramento", 
        "growth_from_2000_to_2013": "55.6%", 
        "latitude": 38.5804609, 
        "longitude": -121.530234, 
        "population": "49891", 
        "rank": "746", 
        "state": "California"
    }, 
    {
        "name": "Burien", 
        "growth_from_2000_to_2013": "56.7%", 
        "latitude": 47.4703767, 
        "longitude": -122.3467918, 
        "population": "49858", 
        "rank": "747", 
        "state": "Washington"
    }, 
    {
        "name": "Commerce_City", 
        "growth_from_2000_to_2013": "135.4%", 
        "latitude": 39.8083196, 
        "longitude": -104.9338675, 
        "population": "49799", 
        "rank": "748", 
        "state": "Colorado"
    }, 
    {
        "name": "Monroe", 
        "growth_from_2000_to_2013": "-6.1%", 
        "latitude": 32.5093109, 
        "longitude": -92.1193012, 
        "population": "49761", 
        "rank": "749", 
        "state": "Louisiana"
    }, 
    {
        "name": "Cerritos", 
        "growth_from_2000_to_2013": "-3.6%", 
        "latitude": 33.8583483, 
        "longitude": -118.0647871, 
        "population": "49707", 
        "rank": "750", 
        "state": "California"
    }, 
    {
        "name": "Downers_Grove", 
        "growth_from_2000_to_2013": "0.0%", 
        "latitude": 41.8089191, 
        "longitude": -88.01117459999999, 
        "population": "49670", 
        "rank": "751", 
        "state": "Illinois"
    }, 
    {
        "name": "Coral_Gables", 
        "growth_from_2000_to_2013": "16.1%", 
        "latitude": 25.72149, 
        "longitude": -80.2683838, 
        "population": "49631", 
        "rank": "752", 
        "state": "Florida"
    }, 
    {
        "name": "Wilson", 
        "growth_from_2000_to_2013": "10.1%", 
        "latitude": 35.7212689, 
        "longitude": -77.9155395, 
        "population": "49628", 
        "rank": "753", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Niagara_Falls", 
        "growth_from_2000_to_2013": "-10.8%", 
        "latitude": 43.0962143, 
        "longitude": -79.0377388, 
        "population": "49468", 
        "rank": "754", 
        "state": "New_York"
    }, 
    {
        "name": "Poway", 
        "growth_from_2000_to_2013": "2.4%", 
        "latitude": 32.9628232, 
        "longitude": -117.0358646, 
        "population": "49417", 
        "rank": "755", 
        "state": "California"
    }, 
    {
        "name": "Edina", 
        "growth_from_2000_to_2013": "4.1%", 
        "latitude": 44.8896866, 
        "longitude": -93.3499489, 
        "population": "49376", 
        "rank": "756", 
        "state": "Minnesota"
    }, 
    {
        "name": "Cuyahoga_Falls", 
        "growth_from_2000_to_2013": "-0.2%", 
        "latitude": 41.1339449, 
        "longitude": -81.48455849999999, 
        "population": "49267", 
        "rank": "757", 
        "state": "Ohio"
    }, 
    {
        "name": "Rancho Santa Margarita", 
        "growth_from_2000_to_2013": "4.6%", 
        "latitude": 33.640855, 
        "longitude": -117.603104, 
        "population": "49228", 
        "rank": "758", 
        "state": "California"
    }, 
    {
        "name": "Harrisburg", 
        "growth_from_2000_to_2013": "0.6%", 
        "latitude": 40.2731911, 
        "longitude": -76.8867008, 
        "population": "49188", 
        "rank": "759", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Huntington", 
        "growth_from_2000_to_2013": "-5.0%", 
        "latitude": 38.4192496, 
        "longitude": -82.44515400000002, 
        "population": "49177", 
        "rank": "760", 
        "state": "West_Virginia"
    }, 
    {
        "name": "La_Mirada", 
        "growth_from_2000_to_2013": "4.6%", 
        "latitude": 33.9172357, 
        "longitude": -118.0120086, 
        "population": "49133", 
        "rank": "761", 
        "state": "California"
    }, 
    {
        "name": "Cypress", 
        "growth_from_2000_to_2013": "5.3%", 
        "latitude": 33.8169599, 
        "longitude": -118.0372852, 
        "population": "49087", 
        "rank": "762", 
        "state": "California"
    }, 
    {
        "name": "Caldwell", 
        "growth_from_2000_to_2013": "77.1%", 
        "latitude": 43.66293839999999, 
        "longitude": -116.6873596, 
        "population": "48957", 
        "rank": "763", 
        "state": "Idaho"
    }, 
    {
        "name": "Logan", 
        "growth_from_2000_to_2013": "14.5%", 
        "latitude": 41.7369803, 
        "longitude": -111.8338359, 
        "population": "48913", 
        "rank": "764", 
        "state": "Utah"
    }, 
    {
        "name": "Galveston", 
        "growth_from_2000_to_2013": "-15.2%", 
        "latitude": 29.3013479, 
        "longitude": -94.7976958, 
        "population": "48733", 
        "rank": "765", 
        "state": "Texas"
    }, 
    {
        "name": "Sheboygan", 
        "growth_from_2000_to_2013": "-3.9%", 
        "latitude": 43.7508284, 
        "longitude": -87.71453, 
        "population": "48725", 
        "rank": "766", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Middletown", 
        "growth_from_2000_to_2013": "-5.7%", 
        "latitude": 39.5150576, 
        "longitude": -84.39827629999999, 
        "population": "48630", 
        "rank": "767", 
        "state": "Ohio"
    }, 
    {
        "name": "Murray", 
        "growth_from_2000_to_2013": "6.6%", 
        "latitude": 40.6668916, 
        "longitude": -111.8879909, 
        "population": "48612", 
        "rank": "768", 
        "state": "Utah"
    }, 
    {
        "name": "Roswell", 
        "growth_from_2000_to_2013": "7.5%", 
        "latitude": 33.3942655, 
        "longitude": -104.5230242, 
        "population": "48611", 
        "rank": "769", 
        "state": "New_Mexico"
    }, 
    {
        "name": "Parker", 
        "growth_from_2000_to_2013": "96.4%", 
        "latitude": 39.5186002, 
        "longitude": -104.7613633, 
        "population": "48608", 
        "rank": "770", 
        "state": "Colorado"
    }, 
    {
        "name": "Bedford", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 32.844017, 
        "longitude": -97.1430671, 
        "population": "48592", 
        "rank": "771", 
        "state": "Texas"
    }, 
    {
        "name": "East_Lansing", 
        "growth_from_2000_to_2013": "4.2%", 
        "latitude": 42.7369792, 
        "longitude": -84.48386540000001, 
        "population": "48554", 
        "rank": "772", 
        "state": "Michigan"
    }, 
    {
        "name": "Methuen", 
        "growth_from_2000_to_2013": "10.3%", 
        "latitude": 42.7262016, 
        "longitude": -71.1908924, 
        "population": "48514", 
        "rank": "773", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Covina", 
        "growth_from_2000_to_2013": "3.3%", 
        "latitude": 34.0900091, 
        "longitude": -117.8903397, 
        "population": "48508", 
        "rank": "774", 
        "state": "California"
    }, 
    {
        "name": "Alexandria", 
        "growth_from_2000_to_2013": "4.1%", 
        "latitude": 31.3112936, 
        "longitude": -92.4451371, 
        "population": "48426", 
        "rank": "775", 
        "state": "Louisiana"
    }, 
    {
        "name": "Olympia", 
        "growth_from_2000_to_2013": "12.1%", 
        "latitude": 47.0378741, 
        "longitude": -122.9006951, 
        "population": "48338", 
        "rank": "776", 
        "state": "Washington"
    }, 
    {
        "name": "Euclid", 
        "growth_from_2000_to_2013": "-8.4%", 
        "latitude": 41.5931049, 
        "longitude": -81.5267873, 
        "population": "48139", 
        "rank": "777", 
        "state": "Ohio"
    }, 
    {
        "name": "Mishawaka", 
        "growth_from_2000_to_2013": "2.0%", 
        "latitude": 41.6619927, 
        "longitude": -86.15861559999999, 
        "population": "47989", 
        "rank": "778", 
        "state": "Indiana"
    }, 
    {
        "name": "Salina", 
        "growth_from_2000_to_2013": "4.5%", 
        "latitude": 38.8402805, 
        "longitude": -97.61142369999999, 
        "population": "47846", 
        "rank": "779", 
        "state": "Kansas"
    }, 
    {
        "name": "Azusa", 
        "growth_from_2000_to_2013": "6.7%", 
        "latitude": 34.1336186, 
        "longitude": -117.9075627, 
        "population": "47842", 
        "rank": "780", 
        "state": "California"
    }, 
    {
        "name": "Newark", 
        "growth_from_2000_to_2013": "3.1%", 
        "latitude": 40.0581205, 
        "longitude": -82.4012642, 
        "population": "47777", 
        "rank": "781", 
        "state": "Ohio"
    }, 
    {
        "name": "Chesterfield", 
        "growth_from_2000_to_2013": "1.9%", 
        "latitude": 38.6631083, 
        "longitude": -90.5770675, 
        "population": "47749", 
        "rank": "782", 
        "state": "Missouri"
    }, 
    {
        "name": "Leesburg", 
        "growth_from_2000_to_2013": "66.0%", 
        "latitude": 39.1156615, 
        "longitude": -77.56360149999999, 
        "population": "47673", 
        "rank": "783", 
        "state": "Virginia"
    }, 
    {
        "name": "Dunwoody", 
        "growth_from_2000_to_2013": "", 
        "latitude": 33.9462125, 
        "longitude": -84.3346473, 
        "population": "47591", 
        "rank": "784", 
        "state": "Georgia"
    }, 
    {
        "name": "Hattiesburg", 
        "growth_from_2000_to_2013": "3.1%", 
        "latitude": 31.3271189, 
        "longitude": -89.29033919999999, 
        "population": "47556", 
        "rank": "785", 
        "state": "Mississippi"
    }, 
    {
        "name": "Roseville", 
        "growth_from_2000_to_2013": "-1.0%", 
        "latitude": 42.4972583, 
        "longitude": -82.9371409, 
        "population": "47555", 
        "rank": "786", 
        "state": "Michigan"
    }, 
    {
        "name": "Bonita_Springs", 
        "growth_from_2000_to_2013": "43.8%", 
        "latitude": 26.339806, 
        "longitude": -81.7786972, 
        "population": "47547", 
        "rank": "787", 
        "state": "Florida"
    }, 
    {
        "name": "Portage", 
        "growth_from_2000_to_2013": "5.7%", 
        "latitude": 42.2011538, 
        "longitude": -85.5800022, 
        "population": "47523", 
        "rank": "788", 
        "state": "Michigan"
    }, 
    {
        "name": "St. Louis Park", 
        "growth_from_2000_to_2013": "7.3%", 
        "latitude": 44.9597376, 
        "longitude": -93.3702186, 
        "population": "47411", 
        "rank": "789", 
        "state": "Minnesota"
    }, 
    {
        "name": "Collierville", 
        "growth_from_2000_to_2013": "43.4%", 
        "latitude": 35.042036, 
        "longitude": -89.6645266, 
        "population": "47333", 
        "rank": "790", 
        "state": "Tennessee"
    }, 
    {
        "name": "Middletown", 
        "growth_from_2000_to_2013": "3.6%", 
        "latitude": 41.5623209, 
        "longitude": -72.6506488, 
        "population": "47333", 
        "rank": "791", 
        "state": "Connecticut"
    }, 
    {
        "name": "Stillwater", 
        "growth_from_2000_to_2013": "20.1%", 
        "latitude": 36.1156071, 
        "longitude": -97.0583681, 
        "population": "47186", 
        "rank": "792", 
        "state": "Oklahoma"
    }, 
    {
        "name": "East_Providence", 
        "growth_from_2000_to_2013": "-3.3%", 
        "latitude": 41.8137116, 
        "longitude": -71.3700545, 
        "population": "47149", 
        "rank": "793", 
        "state": "Rhode_Island"
    }, 
    {
        "name": "Lawrence", 
        "growth_from_2000_to_2013": "20.5%", 
        "latitude": 39.8386516, 
        "longitude": -86.0252612, 
        "population": "47135", 
        "rank": "794", 
        "state": "Indiana"
    }, 
    {
        "name": "Wauwatosa", 
        "growth_from_2000_to_2013": "0.0%", 
        "latitude": 43.0494572, 
        "longitude": -88.0075875, 
        "population": "47134", 
        "rank": "795", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Mentor", 
        "growth_from_2000_to_2013": "-6.6%", 
        "latitude": 41.6661573, 
        "longitude": -81.339552, 
        "population": "46979", 
        "rank": "796", 
        "state": "Ohio"
    }, 
    {
        "name": "Ceres", 
        "growth_from_2000_to_2013": "34.0%", 
        "latitude": 37.5949316, 
        "longitude": -120.9577098, 
        "population": "46714", 
        "rank": "797", 
        "state": "California"
    }, 
    {
        "name": "Cedar_Hill", 
        "growth_from_2000_to_2013": "42.4%", 
        "latitude": 32.5884689, 
        "longitude": -96.9561152, 
        "population": "46663", 
        "rank": "798", 
        "state": "Texas"
    }, 
    {
        "name": "Mansfield", 
        "growth_from_2000_to_2013": "-10.1%", 
        "latitude": 40.75839, 
        "longitude": -82.5154471, 
        "population": "46454", 
        "rank": "799", 
        "state": "Ohio"
    }, 
    {
        "name": "Binghamton", 
        "growth_from_2000_to_2013": "-1.7%", 
        "latitude": 42.09868669999999, 
        "longitude": -75.91797380000001, 
        "population": "46444", 
        "rank": "800", 
        "state": "New_York"
    }, 
    {
        "name": "Coeur d'Alene", 
        "growth_from_2000_to_2013": "32.8%", 
        "latitude": 47.6776832, 
        "longitude": -116.7804664, 
        "population": "46402", 
        "rank": "801", 
        "state": "Idaho"
    }, 
    {
        "name": "San Luis Obispo", 
        "growth_from_2000_to_2013": "4.4%", 
        "latitude": 35.2827524, 
        "longitude": -120.6596156, 
        "population": "46377", 
        "rank": "802", 
        "state": "California"
    }, 
    {
        "name": "Minot", 
        "growth_from_2000_to_2013": "26.6%", 
        "latitude": 48.2329668, 
        "longitude": -101.2922906, 
        "population": "46321", 
        "rank": "803", 
        "state": "North_Dakota"
    }, 
    {
        "name": "Palm_Springs", 
        "growth_from_2000_to_2013": "7.7%", 
        "latitude": 33.8302961, 
        "longitude": -116.5452921, 
        "population": "46281", 
        "rank": "804", 
        "state": "California"
    }, 
    {
        "name": "Pine_Bluff", 
        "growth_from_2000_to_2013": "-16.2%", 
        "latitude": 34.2284312, 
        "longitude": -92.00319549999999, 
        "population": "46094", 
        "rank": "805", 
        "state": "Arkansas"
    }, 
    {
        "name": "Texas_City", 
        "growth_from_2000_to_2013": "10.3%", 
        "latitude": 29.383845, 
        "longitude": -94.9027002, 
        "population": "46081", 
        "rank": "806", 
        "state": "Texas"
    }, 
    {
        "name": "Summerville", 
        "growth_from_2000_to_2013": "62.9%", 
        "latitude": 33.0185039, 
        "longitude": -80.17564809999999, 
        "population": "46074", 
        "rank": "807", 
        "state": "South_Carolina"
    }, 
    {
        "name": "Twin_Falls", 
        "growth_from_2000_to_2013": "31.5%", 
        "latitude": 42.5629668, 
        "longitude": -114.4608711, 
        "population": "45981", 
        "rank": "808", 
        "state": "Idaho"
    }, 
    {
        "name": "Jeffersonville", 
        "growth_from_2000_to_2013": "53.3%", 
        "latitude": 38.2775702, 
        "longitude": -85.7371847, 
        "population": "45929", 
        "rank": "809", 
        "state": "Indiana"
    }, 
    {
        "name": "San_Jacinto", 
        "growth_from_2000_to_2013": "91.8%", 
        "latitude": 33.7839084, 
        "longitude": -116.958635, 
        "population": "45851", 
        "rank": "810", 
        "state": "California"
    }, 
    {
        "name": "Madison", 
        "growth_from_2000_to_2013": "53.7%", 
        "latitude": 34.6992579, 
        "longitude": -86.74833180000002, 
        "population": "45799", 
        "rank": "811", 
        "state": "Alabama"
    }, 
    {
        "name": "Altoona", 
        "growth_from_2000_to_2013": "-7.3%", 
        "latitude": 40.5186809, 
        "longitude": -78.3947359, 
        "population": "45796", 
        "rank": "812", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Columbus", 
        "growth_from_2000_to_2013": "16.4%", 
        "latitude": 39.2014404, 
        "longitude": -85.9213796, 
        "population": "45775", 
        "rank": "813", 
        "state": "Indiana"
    }, 
    {
        "name": "Beavercreek", 
        "growth_from_2000_to_2013": "19.0%", 
        "latitude": 39.7092262, 
        "longitude": -84.06326849999999, 
        "population": "45712", 
        "rank": "814", 
        "state": "Ohio"
    }, 
    {
        "name": "Apopka", 
        "growth_from_2000_to_2013": "63.9%", 
        "latitude": 28.6934076, 
        "longitude": -81.5322149, 
        "population": "45587", 
        "rank": "815", 
        "state": "Florida"
    }, 
    {
        "name": "Elmhurst", 
        "growth_from_2000_to_2013": "5.7%", 
        "latitude": 41.8994744, 
        "longitude": -87.9403418, 
        "population": "45556", 
        "rank": "816", 
        "state": "Illinois"
    }, 
    {
        "name": "Maricopa", 
        "growth_from_2000_to_2013": "2503.4%", 
        "latitude": 33.0581063, 
        "longitude": -112.0476423, 
        "population": "45508", 
        "rank": "817", 
        "state": "Arizona"
    }, 
    {
        "name": "Farmington", 
        "growth_from_2000_to_2013": "18.1%", 
        "latitude": 36.72805830000001, 
        "longitude": -108.2186856, 
        "population": "45426", 
        "rank": "818", 
        "state": "New_Mexico"
    }, 
    {
        "name": "Glenview", 
        "growth_from_2000_to_2013": "5.2%", 
        "latitude": 42.0697509, 
        "longitude": -87.7878408, 
        "population": "45417", 
        "rank": "819", 
        "state": "Illinois"
    }, 
    {
        "name": "Cleveland_Heights", 
        "growth_from_2000_to_2013": "-10.3%", 
        "latitude": 41.5200518, 
        "longitude": -81.556235, 
        "population": "45394", 
        "rank": "820", 
        "state": "Ohio"
    }, 
    {
        "name": "Draper", 
        "growth_from_2000_to_2013": "77.4%", 
        "latitude": 40.5246711, 
        "longitude": -111.8638226, 
        "population": "45285", 
        "rank": "821", 
        "state": "Utah"
    }, 
    {
        "name": "Lincoln", 
        "growth_from_2000_to_2013": "285.2%", 
        "latitude": 38.891565, 
        "longitude": -121.2930079, 
        "population": "45237", 
        "rank": "822", 
        "state": "California"
    }, 
    {
        "name": "Sierra_Vista", 
        "growth_from_2000_to_2013": "19.3%", 
        "latitude": 31.5455001, 
        "longitude": -110.2772856, 
        "population": "45129", 
        "rank": "823", 
        "state": "Arizona"
    }, 
    {
        "name": "Lacey", 
        "growth_from_2000_to_2013": "41.7%", 
        "latitude": 47.03426289999999, 
        "longitude": -122.8231915, 
        "population": "44919", 
        "rank": "824", 
        "state": "Washington"
    }, 
    {
        "name": "Biloxi", 
        "growth_from_2000_to_2013": "-11.5%", 
        "latitude": 30.3960318, 
        "longitude": -88.88530779999999, 
        "population": "44820", 
        "rank": "825", 
        "state": "Mississippi"
    }, 
    {
        "name": "Strongsville", 
        "growth_from_2000_to_2013": "1.9%", 
        "latitude": 41.3144966, 
        "longitude": -81.83569, 
        "population": "44730", 
        "rank": "826", 
        "state": "Ohio"
    }, 
    {
        "name": "Barnstable_Town", 
        "growth_from_2000_to_2013": "-7.1%", 
        "latitude": 41.7003208, 
        "longitude": -70.3002024, 
        "population": "44641", 
        "rank": "827", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Wylie", 
        "growth_from_2000_to_2013": "185.2%", 
        "latitude": 33.0151201, 
        "longitude": -96.5388789, 
        "population": "44575", 
        "rank": "828", 
        "state": "Texas"
    }, 
    {
        "name": "Sayreville", 
        "growth_from_2000_to_2013": "9.6%", 
        "latitude": 40.45940210000001, 
        "longitude": -74.360846, 
        "population": "44412", 
        "rank": "829", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Kannapolis", 
        "growth_from_2000_to_2013": "18.6%", 
        "latitude": 35.4873613, 
        "longitude": -80.6217341, 
        "population": "44359", 
        "rank": "830", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Charlottesville", 
        "growth_from_2000_to_2013": "10.5%", 
        "latitude": 38.0293059, 
        "longitude": -78.47667810000002, 
        "population": "44349", 
        "rank": "831", 
        "state": "Virginia"
    }, 
    {
        "name": "Littleton", 
        "growth_from_2000_to_2013": "9.4%", 
        "latitude": 39.613321, 
        "longitude": -105.0166498, 
        "population": "44275", 
        "rank": "832", 
        "state": "Colorado"
    }, 
    {
        "name": "Titusville", 
        "growth_from_2000_to_2013": "7.8%", 
        "latitude": 28.6122187, 
        "longitude": -80.8075537, 
        "population": "44206", 
        "rank": "833", 
        "state": "Florida"
    }, 
    {
        "name": "Hackensack", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 40.8859325, 
        "longitude": -74.0434736, 
        "population": "44113", 
        "rank": "834", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Newark", 
        "growth_from_2000_to_2013": "3.3%", 
        "latitude": 37.5296593, 
        "longitude": -122.0402399, 
        "population": "44096", 
        "rank": "835", 
        "state": "California"
    }, 
    {
        "name": "Pittsfield", 
        "growth_from_2000_to_2013": "-3.6%", 
        "latitude": 42.4500845, 
        "longitude": -73.2453824, 
        "population": "44057", 
        "rank": "836", 
        "state": "Massachusetts"
    }, 
    {
        "name": "York", 
        "growth_from_2000_to_2013": "6.4%", 
        "latitude": 39.9625984, 
        "longitude": -76.727745, 
        "population": "43935", 
        "rank": "837", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Lombard", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 41.8800296, 
        "longitude": -88.00784349999999, 
        "population": "43907", 
        "rank": "838", 
        "state": "Illinois"
    }, 
    {
        "name": "Attleboro", 
        "growth_from_2000_to_2013": "4.6%", 
        "latitude": 41.94454409999999, 
        "longitude": -71.2856082, 
        "population": "43886", 
        "rank": "839", 
        "state": "Massachusetts"
    }, 
    {
        "name": "DeKalb", 
        "growth_from_2000_to_2013": "11.8%", 
        "latitude": 41.9294736, 
        "longitude": -88.75036469999999, 
        "population": "43849", 
        "rank": "840", 
        "state": "Illinois"
    }, 
    {
        "name": "Blacksburg", 
        "growth_from_2000_to_2013": "9.4%", 
        "latitude": 37.2295733, 
        "longitude": -80.4139393, 
        "population": "43609", 
        "rank": "841", 
        "state": "Virginia"
    }, 
    {
        "name": "Dublin", 
        "growth_from_2000_to_2013": "37.6%", 
        "latitude": 40.0992294, 
        "longitude": -83.1140771, 
        "population": "43607", 
        "rank": "842", 
        "state": "Ohio"
    }, 
    {
        "name": "Haltom_City", 
        "growth_from_2000_to_2013": "11.4%", 
        "latitude": 32.7995738, 
        "longitude": -97.26918169999999, 
        "population": "43580", 
        "rank": "843", 
        "state": "Texas"
    }, 
    {
        "name": "Lompoc", 
        "growth_from_2000_to_2013": "5.5%", 
        "latitude": 34.6391501, 
        "longitude": -120.4579409, 
        "population": "43509", 
        "rank": "844", 
        "state": "California"
    }, 
    {
        "name": "El_Centro", 
        "growth_from_2000_to_2013": "13.7%", 
        "latitude": 32.792, 
        "longitude": -115.5630514, 
        "population": "43363", 
        "rank": "845", 
        "state": "California"
    }, 
    {
        "name": "Danville", 
        "growth_from_2000_to_2013": "3.7%", 
        "latitude": 37.8215929, 
        "longitude": -121.9999606, 
        "population": "43341", 
        "rank": "846", 
        "state": "California"
    }, 
    {
        "name": "Jefferson_City", 
        "growth_from_2000_to_2013": "6.7%", 
        "latitude": 38.57670170000001, 
        "longitude": -92.1735164, 
        "population": "43330", 
        "rank": "847", 
        "state": "Missouri"
    }, 
    {
        "name": "Cutler_Bay", 
        "growth_from_2000_to_2013": "42.9%", 
        "latitude": 25.5808323, 
        "longitude": -80.34685929999999, 
        "population": "43328", 
        "rank": "848", 
        "state": "Florida"
    }, 
    {
        "name": "Oakland_Park", 
        "growth_from_2000_to_2013": "2.7%", 
        "latitude": 26.1723065, 
        "longitude": -80.1319893, 
        "population": "43286", 
        "rank": "849", 
        "state": "Florida"
    }, 
    {
        "name": "North Miami Beach", 
        "growth_from_2000_to_2013": "3.6%", 
        "latitude": 25.9331488, 
        "longitude": -80.1625463, 
        "population": "43250", 
        "rank": "850", 
        "state": "Florida"
    }, 
    {
        "name": "Freeport", 
        "growth_from_2000_to_2013": "-1.4%", 
        "latitude": 40.6576022, 
        "longitude": -73.58318349999999, 
        "population": "43167", 
        "rank": "851", 
        "state": "New_York"
    }, 
    {
        "name": "Moline", 
        "growth_from_2000_to_2013": "-1.9%", 
        "latitude": 41.5067003, 
        "longitude": -90.51513419999999, 
        "population": "43116", 
        "rank": "852", 
        "state": "Illinois"
    }, 
    {
        "name": "Coachella", 
        "growth_from_2000_to_2013": "88.4%", 
        "latitude": 33.6803003, 
        "longitude": -116.173894, 
        "population": "43092", 
        "rank": "853", 
        "state": "California"
    }, 
    {
        "name": "Fort_Pierce", 
        "growth_from_2000_to_2013": "6.9%", 
        "latitude": 27.4467056, 
        "longitude": -80.3256056, 
        "population": "43074", 
        "rank": "854", 
        "state": "Florida"
    }, 
    {
        "name": "Smyrna", 
        "growth_from_2000_to_2013": "54.9%", 
        "latitude": 35.9828412, 
        "longitude": -86.5186045, 
        "population": "43060", 
        "rank": "855", 
        "state": "Tennessee"
    }, 
    {
        "name": "Bountiful", 
        "growth_from_2000_to_2013": "3.9%", 
        "latitude": 40.8893895, 
        "longitude": -111.880771, 
        "population": "43023", 
        "rank": "856", 
        "state": "Utah"
    }, 
    {
        "name": "Fond du Lac", 
        "growth_from_2000_to_2013": "1.7%", 
        "latitude": 43.7730448, 
        "longitude": -88.4470508, 
        "population": "42970", 
        "rank": "857", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Everett", 
        "growth_from_2000_to_2013": "12.1%", 
        "latitude": 42.40843, 
        "longitude": -71.0536625, 
        "population": "42935", 
        "rank": "858", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Danville", 
        "growth_from_2000_to_2013": "-11.0%", 
        "latitude": 36.5859718, 
        "longitude": -79.39502279999999, 
        "population": "42907", 
        "rank": "859", 
        "state": "Virginia"
    }, 
    {
        "name": "Keller", 
        "growth_from_2000_to_2013": "53.3%", 
        "latitude": 32.9341893, 
        "longitude": -97.229298, 
        "population": "42907", 
        "rank": "860", 
        "state": "Texas"
    }, 
    {
        "name": "Belleville", 
        "growth_from_2000_to_2013": "1.2%", 
        "latitude": 38.5200504, 
        "longitude": -89.9839935, 
        "population": "42895", 
        "rank": "861", 
        "state": "Illinois"
    }, 
    {
        "name": "Bell_Gardens", 
        "growth_from_2000_to_2013": "-2.7%", 
        "latitude": 33.9652918, 
        "longitude": -118.1514588, 
        "population": "42889", 
        "rank": "862", 
        "state": "California"
    }, 
    {
        "name": "Cleveland", 
        "growth_from_2000_to_2013": "14.1%", 
        "latitude": 35.1595182, 
        "longitude": -84.8766115, 
        "population": "42774", 
        "rank": "863", 
        "state": "Tennessee"
    }, 
    {
        "name": "North_Lauderdale", 
        "growth_from_2000_to_2013": "10.8%", 
        "latitude": 26.217305, 
        "longitude": -80.2258811, 
        "population": "42757", 
        "rank": "864", 
        "state": "Florida"
    }, 
    {
        "name": "Fairfield", 
        "growth_from_2000_to_2013": "1.2%", 
        "latitude": 39.3454673, 
        "longitude": -84.5603187, 
        "population": "42635", 
        "rank": "865", 
        "state": "Ohio"
    }, 
    {
        "name": "Salem", 
        "growth_from_2000_to_2013": "5.1%", 
        "latitude": 42.51954, 
        "longitude": -70.8967155, 
        "population": "42544", 
        "rank": "866", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Rancho Palos Verdes", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 33.7444613, 
        "longitude": -118.3870173, 
        "population": "42448", 
        "rank": "867", 
        "state": "California"
    }, 
    {
        "name": "San_Bruno", 
        "growth_from_2000_to_2013": "5.6%", 
        "latitude": 37.6304904, 
        "longitude": -122.4110835, 
        "population": "42443", 
        "rank": "868", 
        "state": "California"
    }, 
    {
        "name": "Concord", 
        "growth_from_2000_to_2013": "4.1%", 
        "latitude": 43.2081366, 
        "longitude": -71.5375718, 
        "population": "42419", 
        "rank": "869", 
        "state": "New_Hampshire"
    }, 
    {
        "name": "Burlington", 
        "growth_from_2000_to_2013": "6.1%", 
        "latitude": 44.4758825, 
        "longitude": -73.21207199999999, 
        "population": "42284", 
        "rank": "870", 
        "state": "Vermont"
    }, 
    {
        "name": "Apex", 
        "growth_from_2000_to_2013": "98.8%", 
        "latitude": 35.732652, 
        "longitude": -78.85028559999999, 
        "population": "42214", 
        "rank": "871", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Midland", 
        "growth_from_2000_to_2013": "0.9%", 
        "latitude": 43.6155825, 
        "longitude": -84.2472116, 
        "population": "42181", 
        "rank": "872", 
        "state": "Michigan"
    }, 
    {
        "name": "Altamonte_Springs", 
        "growth_from_2000_to_2013": "2.0%", 
        "latitude": 28.6611089, 
        "longitude": -81.3656242, 
        "population": "42150", 
        "rank": "873", 
        "state": "Florida"
    }, 
    {
        "name": "Hutchinson", 
        "growth_from_2000_to_2013": "0.1%", 
        "latitude": 38.0608445, 
        "longitude": -97.92977429999999, 
        "population": "41889", 
        "rank": "874", 
        "state": "Kansas"
    }, 
    {
        "name": "Buffalo_Grove", 
        "growth_from_2000_to_2013": "-3.4%", 
        "latitude": 42.1662831, 
        "longitude": -87.9631308, 
        "population": "41778", 
        "rank": "875", 
        "state": "Illinois"
    }, 
    {
        "name": "Urbandale", 
        "growth_from_2000_to_2013": "41.5%", 
        "latitude": 41.6266555, 
        "longitude": -93.71216559999999, 
        "population": "41776", 
        "rank": "876", 
        "state": "Iowa"
    }, 
    {
        "name": "State_College", 
        "growth_from_2000_to_2013": "8.7%", 
        "latitude": 40.7933949, 
        "longitude": -77.8600012, 
        "population": "41757", 
        "rank": "877", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Urbana", 
        "growth_from_2000_to_2013": "10.3%", 
        "latitude": 40.1105875, 
        "longitude": -88.2072697, 
        "population": "41752", 
        "rank": "878", 
        "state": "Illinois"
    }, 
    {
        "name": "Plainfield", 
        "growth_from_2000_to_2013": "203.6%", 
        "latitude": 41.632223, 
        "longitude": -88.2120315, 
        "population": "41734", 
        "rank": "879", 
        "state": "Illinois"
    }, 
    {
        "name": "Manassas", 
        "growth_from_2000_to_2013": "19.5%", 
        "latitude": 38.7509488, 
        "longitude": -77.47526669999999, 
        "population": "41705", 
        "rank": "880", 
        "state": "Virginia"
    }, 
    {
        "name": "Bartlett", 
        "growth_from_2000_to_2013": "13.1%", 
        "latitude": 41.9950276, 
        "longitude": -88.1856301, 
        "population": "41679", 
        "rank": "881", 
        "state": "Illinois"
    }, 
    {
        "name": "Kearny", 
        "growth_from_2000_to_2013": "2.8%", 
        "latitude": 40.7684342, 
        "longitude": -74.1454214, 
        "population": "41664", 
        "rank": "882", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Oro_Valley", 
        "growth_from_2000_to_2013": "27.0%", 
        "latitude": 32.3909071, 
        "longitude": -110.966488, 
        "population": "41627", 
        "rank": "883", 
        "state": "Arizona"
    }, 
    {
        "name": "Findlay", 
        "growth_from_2000_to_2013": "5.8%", 
        "latitude": 41.04422, 
        "longitude": -83.6499321, 
        "population": "41512", 
        "rank": "884", 
        "state": "Ohio"
    }, 
    {
        "name": "Rohnert_Park", 
        "growth_from_2000_to_2013": "0.0%", 
        "latitude": 38.3396367, 
        "longitude": -122.7010984, 
        "population": "41398", 
        "rank": "885", 
        "state": "California"
    }, 
    {
        "name": "Westfield", 
        "growth_from_2000_to_2013": "3.0%", 
        "latitude": 42.1250929, 
        "longitude": -72.749538, 
        "population": "41301", 
        "rank": "887", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Linden", 
        "growth_from_2000_to_2013": "4.7%", 
        "latitude": 40.6220478, 
        "longitude": -74.24459019999999, 
        "population": "41301", 
        "rank": "886", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Sumter", 
        "growth_from_2000_to_2013": "1.3%", 
        "latitude": 33.9204354, 
        "longitude": -80.3414693, 
        "population": "41190", 
        "rank": "888", 
        "state": "South_Carolina"
    }, 
    {
        "name": "Wilkes-Barre", 
        "growth_from_2000_to_2013": "-4.3%", 
        "latitude": 41.2459149, 
        "longitude": -75.88130749999999, 
        "population": "41108", 
        "rank": "889", 
        "state": "Pennsylvania"
    }, 
    {
        "name": "Woonsocket", 
        "growth_from_2000_to_2013": "-5.2%", 
        "latitude": 42.00287609999999, 
        "longitude": -71.51478390000001, 
        "population": "41026", 
        "rank": "890", 
        "state": "Rhode_Island"
    }, 
    {
        "name": "Leominster", 
        "growth_from_2000_to_2013": "-1.1%", 
        "latitude": 42.5250906, 
        "longitude": -71.759794, 
        "population": "41002", 
        "rank": "891", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Shelton", 
        "growth_from_2000_to_2013": "7.3%", 
        "latitude": 41.3164856, 
        "longitude": -73.0931641, 
        "population": "40999", 
        "rank": "892", 
        "state": "Connecticut"
    }, 
    {
        "name": "Brea", 
        "growth_from_2000_to_2013": "15.2%", 
        "latitude": 33.9166805, 
        "longitude": -117.9000604, 
        "population": "40963", 
        "rank": "893", 
        "state": "California"
    }, 
    {
        "name": "Covington", 
        "growth_from_2000_to_2013": "-4.7%", 
        "latitude": 39.0836712, 
        "longitude": -84.5085536, 
        "population": "40956", 
        "rank": "894", 
        "state": "Kentucky"
    }, 
    {
        "name": "Rockwall", 
        "growth_from_2000_to_2013": "117.2%", 
        "latitude": 32.93123360000001, 
        "longitude": -96.4597089, 
        "population": "40922", 
        "rank": "895", 
        "state": "Texas"
    }, 
    {
        "name": "Meridian", 
        "growth_from_2000_to_2013": "-0.9%", 
        "latitude": 32.3643098, 
        "longitude": -88.703656, 
        "population": "40921", 
        "rank": "896", 
        "state": "Mississippi"
    }, 
    {
        "name": "Riverton", 
        "growth_from_2000_to_2013": "61.6%", 
        "latitude": 40.521893, 
        "longitude": -111.9391023, 
        "population": "40921", 
        "rank": "897", 
        "state": "Utah"
    }, 
    {
        "name": "St. Cloud", 
        "growth_from_2000_to_2013": "86.2%", 
        "latitude": 28.2489016, 
        "longitude": -81.2811801, 
        "population": "40918", 
        "rank": "898", 
        "state": "Florida"
    }, 
    {
        "name": "Quincy", 
        "growth_from_2000_to_2013": "0.5%", 
        "latitude": 39.9356016, 
        "longitude": -91.4098726, 
        "population": "40915", 
        "rank": "899", 
        "state": "Illinois"
    }, 
    {
        "name": "Morgan_Hill", 
        "growth_from_2000_to_2013": "19.5%", 
        "latitude": 37.1305012, 
        "longitude": -121.6543901, 
        "population": "40836", 
        "rank": "900", 
        "state": "California"
    }, 
    {
        "name": "Warren", 
        "growth_from_2000_to_2013": "-15.2%", 
        "latitude": 41.2375569, 
        "longitude": -80.81841659999999, 
        "population": "40768", 
        "rank": "901", 
        "state": "Ohio"
    }, 
    {
        "name": "Edmonds", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 47.8106521, 
        "longitude": -122.3773552, 
        "population": "40727", 
        "rank": "902", 
        "state": "Washington"
    }, 
    {
        "name": "Burleson", 
        "growth_from_2000_to_2013": "85.3%", 
        "latitude": 32.5420821, 
        "longitude": -97.3208492, 
        "population": "40714", 
        "rank": "903", 
        "state": "Texas"
    }, 
    {
        "name": "Beverly", 
        "growth_from_2000_to_2013": "2.0%", 
        "latitude": 42.5584283, 
        "longitude": -70.880049, 
        "population": "40664", 
        "rank": "904", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Mankato", 
        "growth_from_2000_to_2013": "24.7%", 
        "latitude": 44.1635775, 
        "longitude": -93.99939959999999, 
        "population": "40641", 
        "rank": "905", 
        "state": "Minnesota"
    }, 
    {
        "name": "Hagerstown", 
        "growth_from_2000_to_2013": "10.4%", 
        "latitude": 39.6417629, 
        "longitude": -77.71999319999999, 
        "population": "40612", 
        "rank": "906", 
        "state": "Maryland"
    }, 
    {
        "name": "Prescott", 
        "growth_from_2000_to_2013": "18.1%", 
        "latitude": 34.5400242, 
        "longitude": -112.4685025, 
        "population": "40590", 
        "rank": "907", 
        "state": "Arizona"
    }, 
    {
        "name": "Campbell", 
        "growth_from_2000_to_2013": "4.2%", 
        "latitude": 37.2871651, 
        "longitude": -121.9499568, 
        "population": "40584", 
        "rank": "908", 
        "state": "California"
    }, 
    {
        "name": "Cedar_Falls", 
        "growth_from_2000_to_2013": "12.0%", 
        "latitude": 42.5348993, 
        "longitude": -92.4453161, 
        "population": "40566", 
        "rank": "909", 
        "state": "Iowa"
    }, 
    {
        "name": "Beaumont", 
        "growth_from_2000_to_2013": "254.5%", 
        "latitude": 33.9294606, 
        "longitude": -116.977248, 
        "population": "40481", 
        "rank": "910", 
        "state": "California"
    }, 
    {
        "name": "La_Puente", 
        "growth_from_2000_to_2013": "-1.6%", 
        "latitude": 34.0200114, 
        "longitude": -117.9495083, 
        "population": "40435", 
        "rank": "911", 
        "state": "California"
    }, 
    {
        "name": "Crystal_Lake", 
        "growth_from_2000_to_2013": "5.3%", 
        "latitude": 42.2411344, 
        "longitude": -88.31619649999999, 
        "population": "40388", 
        "rank": "912", 
        "state": "Illinois"
    }, 
    {
        "name": "Fitchburg", 
        "growth_from_2000_to_2013": "3.5%", 
        "latitude": 42.5834228, 
        "longitude": -71.8022955, 
        "population": "40383", 
        "rank": "913", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Carol_Stream", 
        "growth_from_2000_to_2013": "-0.2%", 
        "latitude": 41.91252859999999, 
        "longitude": -88.13479269999999, 
        "population": "40379", 
        "rank": "914", 
        "state": "Illinois"
    }, 
    {
        "name": "Hickory", 
        "growth_from_2000_to_2013": "7.0%", 
        "latitude": 35.7344538, 
        "longitude": -81.3444573, 
        "population": "40361", 
        "rank": "915", 
        "state": "North_Carolina"
    }, 
    {
        "name": "Streamwood", 
        "growth_from_2000_to_2013": "10.1%", 
        "latitude": 42.0255827, 
        "longitude": -88.17840849999999, 
        "population": "40351", 
        "rank": "916", 
        "state": "Illinois"
    }, 
    {
        "name": "Norwich", 
        "growth_from_2000_to_2013": "11.6%", 
        "latitude": 41.5242649, 
        "longitude": -72.07591049999999, 
        "population": "40347", 
        "rank": "917", 
        "state": "Connecticut"
    }, 
    {
        "name": "Coppell", 
        "growth_from_2000_to_2013": "10.3%", 
        "latitude": 32.9545687, 
        "longitude": -97.01500779999999, 
        "population": "40342", 
        "rank": "918", 
        "state": "Texas"
    }, 
    {
        "name": "San_Gabriel", 
        "growth_from_2000_to_2013": "0.9%", 
        "latitude": 34.09611110000001, 
        "longitude": -118.1058333, 
        "population": "40275", 
        "rank": "919", 
        "state": "California"
    }, 
    {
        "name": "Holyoke", 
        "growth_from_2000_to_2013": "0.9%", 
        "latitude": 42.2042586, 
        "longitude": -72.6162009, 
        "population": "40249", 
        "rank": "920", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Bentonville", 
        "growth_from_2000_to_2013": "97.7%", 
        "latitude": 36.3728538, 
        "longitude": -94.2088172, 
        "population": "40167", 
        "rank": "921", 
        "state": "Arkansas"
    }, 
    {
        "name": "Florence", 
        "growth_from_2000_to_2013": "10.2%", 
        "latitude": 34.79981, 
        "longitude": -87.677251, 
        "population": "40059", 
        "rank": "922", 
        "state": "Alabama"
    }, 
    {
        "name": "Peachtree_Corners", 
        "growth_from_2000_to_2013": "", 
        "latitude": 33.9698929, 
        "longitude": -84.2214551, 
        "population": "40059", 
        "rank": "923", 
        "state": "Georgia"
    }, 
    {
        "name": "Brentwood", 
        "growth_from_2000_to_2013": "51.9%", 
        "latitude": 36.0331164, 
        "longitude": -86.78277720000001, 
        "population": "40021", 
        "rank": "924", 
        "state": "Tennessee"
    }, 
    {
        "name": "Bozeman", 
        "growth_from_2000_to_2013": "41.9%", 
        "latitude": 45.6769979, 
        "longitude": -111.0429339, 
        "population": "39860", 
        "rank": "925", 
        "state": "Montana"
    }, 
    {
        "name": "New_Berlin", 
        "growth_from_2000_to_2013": "3.6%", 
        "latitude": 42.9764027, 
        "longitude": -88.1084224, 
        "population": "39834", 
        "rank": "926", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Goose_Creek", 
        "growth_from_2000_to_2013": "26.1%", 
        "latitude": 32.9810059, 
        "longitude": -80.03258670000001, 
        "population": "39823", 
        "rank": "927", 
        "state": "South_Carolina"
    }, 
    {
        "name": "Huntsville", 
        "growth_from_2000_to_2013": "13.2%", 
        "latitude": 30.7235263, 
        "longitude": -95.55077709999999, 
        "population": "39795", 
        "rank": "928", 
        "state": "Texas"
    }, 
    {
        "name": "Prescott_Valley", 
        "growth_from_2000_to_2013": "62.9%", 
        "latitude": 34.6100243, 
        "longitude": -112.315721, 
        "population": "39791", 
        "rank": "929", 
        "state": "Arizona"
    }, 
    {
        "name": "Maplewood", 
        "growth_from_2000_to_2013": "12.3%", 
        "latitude": 44.9530215, 
        "longitude": -92.9952153, 
        "population": "39765", 
        "rank": "930", 
        "state": "Minnesota"
    }, 
    {
        "name": "Romeoville", 
        "growth_from_2000_to_2013": "79.5%", 
        "latitude": 41.6475306, 
        "longitude": -88.0895061, 
        "population": "39650", 
        "rank": "931", 
        "state": "Illinois"
    }, 
    {
        "name": "Duncanville", 
        "growth_from_2000_to_2013": "9.7%", 
        "latitude": 32.6518004, 
        "longitude": -96.9083366, 
        "population": "39605", 
        "rank": "932", 
        "state": "Texas"
    }, 
    {
        "name": "Atlantic_City", 
        "growth_from_2000_to_2013": "-2.2%", 
        "latitude": 39.3642834, 
        "longitude": -74.4229266, 
        "population": "39551", 
        "rank": "933", 
        "state": "New_Jersey"
    }, 
    {
        "name": "Clovis", 
        "growth_from_2000_to_2013": "21.3%", 
        "latitude": 34.4047987, 
        "longitude": -103.2052272, 
        "population": "39508", 
        "rank": "934", 
        "state": "New_Mexico"
    }, 
    {
        "name": "The_Colony", 
        "growth_from_2000_to_2013": "45.7%", 
        "latitude": 33.0806083, 
        "longitude": -96.89283089999999, 
        "population": "39458", 
        "rank": "935", 
        "state": "Texas"
    }, 
    {
        "name": "Culver_City", 
        "growth_from_2000_to_2013": "1.3%", 
        "latitude": 34.0211224, 
        "longitude": -118.3964665, 
        "population": "39428", 
        "rank": "936", 
        "state": "California"
    }, 
    {
        "name": "Marlborough", 
        "growth_from_2000_to_2013": "7.6%", 
        "latitude": 42.3459271, 
        "longitude": -71.5522874, 
        "population": "39414", 
        "rank": "937", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Hilton Head Island", 
        "growth_from_2000_to_2013": "16.0%", 
        "latitude": 32.216316, 
        "longitude": -80.752608, 
        "population": "39412", 
        "rank": "938", 
        "state": "South_Carolina"
    }, 
    {
        "name": "Moorhead", 
        "growth_from_2000_to_2013": "21.3%", 
        "latitude": 46.8737648, 
        "longitude": -96.76780389999999, 
        "population": "39398", 
        "rank": "939", 
        "state": "Minnesota"
    }, 
    {
        "name": "Calexico", 
        "growth_from_2000_to_2013": "44.0%", 
        "latitude": 32.6789476, 
        "longitude": -115.4988834, 
        "population": "39389", 
        "rank": "940", 
        "state": "California"
    }, 
    {
        "name": "Bullhead_City", 
        "growth_from_2000_to_2013": "15.9%", 
        "latitude": 35.1359386, 
        "longitude": -114.5285981, 
        "population": "39383", 
        "rank": "941", 
        "state": "Arizona"
    }, 
    {
        "name": "Germantown", 
        "growth_from_2000_to_2013": "4.1%", 
        "latitude": 35.0867577, 
        "longitude": -89.8100858, 
        "population": "39375", 
        "rank": "942", 
        "state": "Tennessee"
    }, 
    {
        "name": "La_Quinta", 
        "growth_from_2000_to_2013": "59.9%", 
        "latitude": 33.6633573, 
        "longitude": -116.3100095, 
        "population": "39331", 
        "rank": "943", 
        "state": "California"
    }, 
    {
        "name": "Lancaster", 
        "growth_from_2000_to_2013": "10.7%", 
        "latitude": 39.7136754, 
        "longitude": -82.5993294, 
        "population": "39325", 
        "rank": "944", 
        "state": "Ohio"
    }, 
    {
        "name": "Wausau", 
        "growth_from_2000_to_2013": "1.7%", 
        "latitude": 44.9591352, 
        "longitude": -89.6301221, 
        "population": "39309", 
        "rank": "945", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Sherman", 
        "growth_from_2000_to_2013": "11.6%", 
        "latitude": 33.6356618, 
        "longitude": -96.6088805, 
        "population": "39296", 
        "rank": "946", 
        "state": "Texas"
    }, 
    {
        "name": "Ocoee", 
        "growth_from_2000_to_2013": "57.9%", 
        "latitude": 28.5691677, 
        "longitude": -81.5439619, 
        "population": "39172", 
        "rank": "947", 
        "state": "Florida"
    }, 
    {
        "name": "Shakopee", 
        "growth_from_2000_to_2013": "85.7%", 
        "latitude": 44.7973962, 
        "longitude": -93.5272861, 
        "population": "39167", 
        "rank": "948", 
        "state": "Minnesota"
    }, 
    {
        "name": "Woburn", 
        "growth_from_2000_to_2013": "4.4%", 
        "latitude": 42.4792618, 
        "longitude": -71.1522765, 
        "population": "39083", 
        "rank": "949", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Bremerton", 
        "growth_from_2000_to_2013": "4.9%", 
        "latitude": 47.5673202, 
        "longitude": -122.6329356, 
        "population": "39056", 
        "rank": "950", 
        "state": "Washington"
    }, 
    {
        "name": "Rock_Island", 
        "growth_from_2000_to_2013": "-1.9%", 
        "latitude": 41.5094771, 
        "longitude": -90.5787476, 
        "population": "38877", 
        "rank": "951", 
        "state": "Illinois"
    }, 
    {
        "name": "Muskogee", 
        "growth_from_2000_to_2013": "-0.7%", 
        "latitude": 35.7478769, 
        "longitude": -95.3696909, 
        "population": "38863", 
        "rank": "952", 
        "state": "Oklahoma"
    }, 
    {
        "name": "Cape_Girardeau", 
        "growth_from_2000_to_2013": "9.4%", 
        "latitude": 37.3058839, 
        "longitude": -89.51814759999999, 
        "population": "38816", 
        "rank": "953", 
        "state": "Missouri"
    }, 
    {
        "name": "Annapolis", 
        "growth_from_2000_to_2013": "7.6%", 
        "latitude": 38.9784453, 
        "longitude": -76.4921829, 
        "population": "38722", 
        "rank": "954", 
        "state": "Maryland"
    }, 
    {
        "name": "Greenacres", 
        "growth_from_2000_to_2013": "35.5%", 
        "latitude": 26.6276276, 
        "longitude": -80.1353896, 
        "population": "38696", 
        "rank": "955", 
        "state": "Florida"
    }, 
    {
        "name": "Ormond_Beach", 
        "growth_from_2000_to_2013": "5.8%", 
        "latitude": 29.2858129, 
        "longitude": -81.0558894, 
        "population": "38661", 
        "rank": "956", 
        "state": "Florida"
    }, 
    {
        "name": "Hallandale_Beach", 
        "growth_from_2000_to_2013": "12.4%", 
        "latitude": 25.9812024, 
        "longitude": -80.14837899999999, 
        "population": "38632", 
        "rank": "957", 
        "state": "Florida"
    }, 
    {
        "name": "Stanton", 
        "growth_from_2000_to_2013": "2.8%", 
        "latitude": 33.8025155, 
        "longitude": -117.9931165, 
        "population": "38623", 
        "rank": "958", 
        "state": "California"
    }, 
    {
        "name": "Puyallup", 
        "growth_from_2000_to_2013": "11.8%", 
        "latitude": 47.1853785, 
        "longitude": -122.2928974, 
        "population": "38609", 
        "rank": "959", 
        "state": "Washington"
    }, 
    {
        "name": "Pacifica", 
        "growth_from_2000_to_2013": "0.5%", 
        "latitude": 37.6138253, 
        "longitude": -122.4869194, 
        "population": "38606", 
        "rank": "960", 
        "state": "California"
    }, 
    {
        "name": "Hanover_Park", 
        "growth_from_2000_to_2013": "0.6%", 
        "latitude": 41.9994722, 
        "longitude": -88.1450735, 
        "population": "38510", 
        "rank": "961", 
        "state": "Illinois"
    }, 
    {
        "name": "Hurst", 
        "growth_from_2000_to_2013": "5.8%", 
        "latitude": 32.8234621, 
        "longitude": -97.1705678, 
        "population": "38448", 
        "rank": "962", 
        "state": "Texas"
    }, 
    {
        "name": "Lima", 
        "growth_from_2000_to_2013": "-8.1%", 
        "latitude": 40.742551, 
        "longitude": -84.1052256, 
        "population": "38355", 
        "rank": "963", 
        "state": "Ohio"
    }, 
    {
        "name": "Marana", 
        "growth_from_2000_to_2013": "166.2%", 
        "latitude": 32.436381, 
        "longitude": -111.2224422, 
        "population": "38290", 
        "rank": "964", 
        "state": "Arizona"
    }, 
    {
        "name": "Carpentersville", 
        "growth_from_2000_to_2013": "22.8%", 
        "latitude": 42.1211364, 
        "longitude": -88.2578582, 
        "population": "38241", 
        "rank": "965", 
        "state": "Illinois"
    }, 
    {
        "name": "Oakley", 
        "growth_from_2000_to_2013": "47.7%", 
        "latitude": 37.9974219, 
        "longitude": -121.7124536, 
        "population": "38194", 
        "rank": "966", 
        "state": "California"
    }, 
    {
        "name": "Huber_Heights", 
        "growth_from_2000_to_2013": "-0.2%", 
        "latitude": 39.843947, 
        "longitude": -84.12466080000002, 
        "population": "38142", 
        "rank": "967", 
        "state": "Ohio"
    }, 
    {
        "name": "Lancaster", 
        "growth_from_2000_to_2013": "46.4%", 
        "latitude": 32.5920798, 
        "longitude": -96.7561082, 
        "population": "38071", 
        "rank": "968", 
        "state": "Texas"
    }, 
    {
        "name": "Montclair", 
        "growth_from_2000_to_2013": "12.1%", 
        "latitude": 34.0775104, 
        "longitude": -117.6897776, 
        "population": "38027", 
        "rank": "969", 
        "state": "California"
    }, 
    {
        "name": "Wheeling", 
        "growth_from_2000_to_2013": "4.8%", 
        "latitude": 42.1391927, 
        "longitude": -87.9289591, 
        "population": "38015", 
        "rank": "970", 
        "state": "Illinois"
    }, 
    {
        "name": "Brookfield", 
        "growth_from_2000_to_2013": "-1.9%", 
        "latitude": 43.0605671, 
        "longitude": -88.1064787, 
        "population": "37999", 
        "rank": "971", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Park_Ridge", 
        "growth_from_2000_to_2013": "0.1%", 
        "latitude": 42.0111412, 
        "longitude": -87.84061919999999, 
        "population": "37839", 
        "rank": "972", 
        "state": "Illinois"
    }, 
    {
        "name": "Florence", 
        "growth_from_2000_to_2013": "19.8%", 
        "latitude": 34.1954331, 
        "longitude": -79.7625625, 
        "population": "37792", 
        "rank": "973", 
        "state": "South_Carolina"
    }, 
    {
        "name": "Roy", 
        "growth_from_2000_to_2013": "13.3%", 
        "latitude": 41.1616108, 
        "longitude": -112.0263313, 
        "population": "37733", 
        "rank": "974", 
        "state": "Utah"
    }, 
    {
        "name": "Winter_Garden", 
        "growth_from_2000_to_2013": "142.5%", 
        "latitude": 28.5652787, 
        "longitude": -81.58618469999999, 
        "population": "37711", 
        "rank": "975", 
        "state": "Florida"
    }, 
    {
        "name": "Chelsea", 
        "growth_from_2000_to_2013": "7.3%", 
        "latitude": 42.3917638, 
        "longitude": -71.0328284, 
        "population": "37670", 
        "rank": "976", 
        "state": "Massachusetts"
    }, 
    {
        "name": "Valley_Stream", 
        "growth_from_2000_to_2013": "3.6%", 
        "latitude": 40.6642699, 
        "longitude": -73.70846449999999, 
        "population": "37659", 
        "rank": "977", 
        "state": "New_York"
    }, 
    {
        "name": "Spartanburg", 
        "growth_from_2000_to_2013": "-6.2%", 
        "latitude": 34.9495672, 
        "longitude": -81.9320482, 
        "population": "37647", 
        "rank": "978", 
        "state": "South_Carolina"
    }, 
    {
        "name": "Lake_Oswego", 
        "growth_from_2000_to_2013": "5.3%", 
        "latitude": 45.42067489999999, 
        "longitude": -122.6706498, 
        "population": "37610", 
        "rank": "979", 
        "state": "Oregon"
    }, 
    {
        "name": "Friendswood", 
        "growth_from_2000_to_2013": "28.6%", 
        "latitude": 29.5293998, 
        "longitude": -95.2010447, 
        "population": "37587", 
        "rank": "980", 
        "state": "Texas"
    }, 
    {
        "name": "Westerville", 
        "growth_from_2000_to_2013": "5.7%", 
        "latitude": 40.1261743, 
        "longitude": -82.92906959999999, 
        "population": "37530", 
        "rank": "981", 
        "state": "Ohio"
    }, 
    {
        "name": "Northglenn", 
        "growth_from_2000_to_2013": "15.5%", 
        "latitude": 39.8961821, 
        "longitude": -104.9811468, 
        "population": "37499", 
        "rank": "982", 
        "state": "Colorado"
    }, 
    {
        "name": "Phenix_City", 
        "growth_from_2000_to_2013": "31.9%", 
        "latitude": 32.4709761, 
        "longitude": -85.0007653, 
        "population": "37498", 
        "rank": "983", 
        "state": "Alabama"
    }, 
    {
        "name": "Grove_City", 
        "growth_from_2000_to_2013": "35.6%", 
        "latitude": 39.88145189999999, 
        "longitude": -83.0929644, 
        "population": "37490", 
        "rank": "984", 
        "state": "Ohio"
    }, 
    {
        "name": "Texarkana", 
        "growth_from_2000_to_2013": "7.4%", 
        "latitude": 33.425125, 
        "longitude": -94.04768820000001, 
        "population": "37442", 
        "rank": "985", 
        "state": "Texas"
    }, 
    {
        "name": "Addison", 
        "growth_from_2000_to_2013": "2.6%", 
        "latitude": 41.931696, 
        "longitude": -87.9889556, 
        "population": "37385", 
        "rank": "986", 
        "state": "Illinois"
    }, 
    {
        "name": "Dover", 
        "growth_from_2000_to_2013": "16.0%", 
        "latitude": 39.158168, 
        "longitude": -75.5243682, 
        "population": "37366", 
        "rank": "987", 
        "state": "Delaware"
    }, 
    {
        "name": "Lincoln_Park", 
        "growth_from_2000_to_2013": "-6.7%", 
        "latitude": 42.2505943, 
        "longitude": -83.1785361, 
        "population": "37313", 
        "rank": "988", 
        "state": "Michigan"
    }, 
    {
        "name": "Calumet_City", 
        "growth_from_2000_to_2013": "-4.5%", 
        "latitude": 41.6155909, 
        "longitude": -87.5294871, 
        "population": "37240", 
        "rank": "989", 
        "state": "Illinois"
    }, 
    {
        "name": "Muskegon", 
        "growth_from_2000_to_2013": "-7.1%", 
        "latitude": 43.2341813, 
        "longitude": -86.24839209999999, 
        "population": "37213", 
        "rank": "990", 
        "state": "Michigan"
    }, 
    {
        "name": "Aventura", 
        "growth_from_2000_to_2013": "47.2%", 
        "latitude": 25.9564812, 
        "longitude": -80.1392121, 
        "population": "37199", 
        "rank": "991", 
        "state": "Florida"
    }, 
    {
        "name": "Martinez", 
        "growth_from_2000_to_2013": "3.4%", 
        "latitude": 38.0193657, 
        "longitude": -122.1341321, 
        "population": "37165", 
        "rank": "992", 
        "state": "California"
    }, 
    {
        "name": "Greenfield", 
        "growth_from_2000_to_2013": "4.8%", 
        "latitude": 42.9614039, 
        "longitude": -88.0125865, 
        "population": "37159", 
        "rank": "993", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Apache_Junction", 
        "growth_from_2000_to_2013": "15.7%", 
        "latitude": 33.4150485, 
        "longitude": -111.5495777, 
        "population": "37130", 
        "rank": "994", 
        "state": "Arizona"
    }, 
    {
        "name": "Monrovia", 
        "growth_from_2000_to_2013": "0.2%", 
        "latitude": 34.1442616, 
        "longitude": -118.0019482, 
        "population": "37101", 
        "rank": "995", 
        "state": "California"
    }, 
    {
        "name": "Weslaco", 
        "growth_from_2000_to_2013": "28.8%", 
        "latitude": 26.1595194, 
        "longitude": -97.9908366, 
        "population": "37093", 
        "rank": "996", 
        "state": "Texas"
    }, 
    {
        "name": "Keizer", 
        "growth_from_2000_to_2013": "14.4%", 
        "latitude": 44.9901194, 
        "longitude": -123.0262077, 
        "population": "37064", 
        "rank": "997", 
        "state": "Oregon"
    }, 
    {
        "name": "Spanish_Fork", 
        "growth_from_2000_to_2013": "78.1%", 
        "latitude": 40.114955, 
        "longitude": -111.654923, 
        "population": "36956", 
        "rank": "998", 
        "state": "Utah"
    }, 
    {
        "name": "Beloit", 
        "growth_from_2000_to_2013": "2.9%", 
        "latitude": 42.5083482, 
        "longitude": -89.03177649999999, 
        "population": "36888", 
        "rank": "999", 
        "state": "Wisconsin"
    }, 
    {
        "name": "Panama_City", 
        "growth_from_2000_to_2013": "0.1%", 
        "latitude": 30.1588129, 
        "longitude": -85.6602058, 
        "population": "36877", 
        "rank": "1000", 
        "state": "Florida"
    }
]

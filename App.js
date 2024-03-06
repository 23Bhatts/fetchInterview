import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// const fetch = require('node-fetch');

// Function to retrieve the data from the given URL
async function fetchHiringData() {
    try {
        const response = await fetch('https://fetch-hiring.s3.amazonaws.com/hiring.json');
        const hiringData = await response.json();
        return hiringData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to group, sort, and filter the data
async function displayItems() {
    let hiringData = await fetchHiringData();
    if (hiringData) {
      // Remove the items with "name" as null or empty, not necessary as we are using reduce to group by listID and can filter there
        
      // for(let i = 0; i < hiringData.length; i++){
        //     if(hiringData[i].name === null || hiringData[i].name === ''){
        //         delete hiringData[i];
        //     }
        // }

        //group by listID and filter out items with name as null or empty
        let groupedByListID = hiringData.reduce((groupsOfIDs, item) => {
            const { listId, name } = item;
            if(name !== null && name.trim() !== ''){
              if(!groupsOfIDs[listId]){
                groupsOfIDs[listId] = [];
              }
              groupsOfIDs[listId].push(item);
            }
            return groupsOfIDs;
        }, {});

        // Sort the items by name in each group
        for(let ID in groupedByListID){
          groupedByListID[ID].sort( (a, b) => {
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
          })
        }
        
        const sortedSingleArray = [...groupedByListID[1], ...groupedByListID[2], ...groupedByListID[3], ...groupedByListID[4]];
        console.log(sortedSingleArray);
        const final = sortedSingleArray.map(item => {
          return item.name;
        });
        console.log(final);

        return final;
    }
}

export default function App() {
  let nonArray = displayItems();
  let grouped = Array.from(nonArray);
  let arr = [0, 1, 2, 3, 4]
  const toBeReturned = grouped.map(item => 
    <li>{item}</li>
  );

  return (
    <View style={styles.container}>
      <h1>PLEASE WORK</h1>
      <ul>{toBeReturned}</ul>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 20,
    fontSize: 15,
    marginTop: 5,
  },
});

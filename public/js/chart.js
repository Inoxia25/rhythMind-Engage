//const emotion = require("../../model/emotion");


async function getEmotions() {
    let url = '/getEmotions';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
async function renderChart(){
    let emotions= await getEmotions();
    const ctx = document.getElementById('myChart').getContext('2d');
    console.log(emotions);
    
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: emotions.dates   /*[
        
      moment(new Date(2020, 2, 1)).format('YYYY-MM-DD'),
      moment(new Date(2020, 2, 2)).format('YYYY-MM-DD'),
      moment(new Date(2020, 2, 3)).format('YYYY-MM-DD')
    ]*/,
    datasets: [{
        label: 'Anger',
        data: emotions.anger,
        borderWidth: 4,
        fill: false,
        borderColor: 'red'
      },
      {
        label: 'Contempt',
        data: emotions.contempt,
        borderWidth: 4,
        fill: false,
        borderColor: 'white'
      },
      {
        label: 'Disgust',
        data: emotions.disgust,
        borderWidth: 4,
        fill: false,
        borderColor: 'green'
      },
      {
        label: 'Fear',
        data: emotions.fear,
        borderWidth: 4,
        fill: false,
        borderColor: 'orange'
      },
      {
        label: 'Neutral',
        data: emotions.neutral,
        borderWidth: 4,
        fill: false,
        borderColor: 'blue'
      },
      {
        label: 'Sadness',
        data: emotions.sadness,
        borderWidth: 4,
        fill: false,
        borderColor: 'purple'
      },
      {
        label: 'Surprise',
        data: emotions.surprise,
        borderWidth: 4,
        fill: false,
        borderColor: 'black'
      },
      {
        label: 'Happiness',
        data: emotions.happiness,
        borderWidth: 4,
        fill: false,
        borderColor: 'yellow'
      }
    ]
  },
  /*options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }*/
});
}
renderChart();
 

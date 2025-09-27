import Test from '../components/Test'
import TranscribeMic from '../components/TranscribeMic';

function Home() {
  console.log("Home rendered");


  return(
    <>
    <Test />
    <TranscribeMic />
    <div>Home Page</div>
    <div>Test</div>
    </>
  );
}

export default Home
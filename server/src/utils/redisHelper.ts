import Queue from "bull";

/**
 * Montor Redis Jobs
 * 
*/
export async function queeMonitor(quee: Queue.Queue<any>, interval?: number) {

  let counter = 0;
  
  let int = setInterval(function () {
    const start = new Date().getTime();
    quee.getJobCounts()
      .then(function (result) {
        const { waiting , active, completed, failed, delayed } = result;
        console.log(`${quee.name} Quee Status: Waiting ${waiting} , Active: ${active}, Completed: ${completed}, Failed: ${failed} `)
        const _elapsed = new Date().getTime() - start;
        console.log(`Counter: ", ${counter}, "Running Time : ", ${_elapsed / 1000}s`);
        console.log("----------");
        counter++;
        
        if (result.active === 0 && counter > 2) {
          console.log("Process Finished !!!");
          const elapsed = new Date().getTime() - start;
          console.log(`--> Time elapsed :  ${elapsed / 1000}s`);
          
          quee.empty();
          clearInterval(int);
        }
      })
      .catch(function () {
        console.log("Error in finding out the status of the queue");
      });
  }, interval || 2000); 
}
document.addEventListener('DOMContentLoaded', () => {
    let timerInterval = null;
    let totalTimeInSeconds = 0;
    let taskHistory = [];
  
    function getCurrentDateAndTime() {
      const now = new Date();
      const today = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });
      const time = now.toLocaleTimeString('en-US', { hour12: false });
      return { today, day, time };
    }
  
    function formatTimeToHHMMSS(totalSeconds) {
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
  
    function updateTime() {
      const hours = String(Math.floor(totalTimeInSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalTimeInSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalTimeInSeconds % 60).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      document.getElementById('timerDisplay').innerText = formattedTime;
      totalTimeInSeconds++;
    }
  
    function startTimer() {
      if (timerInterval === null) {
        timerInterval = setInterval(updateTime, 1000);
        document.getElementById('startStopBtn').classList.add('hidden');
        document.getElementById('stopBtn').classList.remove('hidden');
        const { today, day, time } = getCurrentDateAndTime();
        document.getElementById('startDateTime').innerText = `Started: ${today} (${day}) ${time}`;
      }
    }
  
    function stopTimer() {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('startStopBtn').classList.remove('hidden');
        document.getElementById('stopBtn').classList.add('hidden');
  
        const { today, day, time } = getCurrentDateAndTime();
        const taskName = document.getElementById('taskName').value;
        const taskTime = document.getElementById('timerDisplay').innerText;
  
        if (taskName.trim() !== '') {
          const totalTimeInSeconds = calculateTotalTimeInSeconds(taskTime);
          taskHistory.push({
            name: taskName,
            time: taskTime,
            start: { date: today, day: day, time: time },
            end: { date: today, day: day, time: time },
            totalTime: totalTimeInSeconds // Save Total Time in seconds
          });
        }
  
        document.getElementById('taskName').value = '';
        totalTimeInSeconds = 0;
        updateTime();
        updateTaskHistoryTable();
      }
    }
  
    function calculateTotalTimeInSeconds(timeString) {
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    }
  
    function updateTaskHistoryTable() {
        const tableBody = document.getElementById('taskHistoryTableBody');
        tableBody.innerHTML = taskHistory.map(task => `
          <tr>
            <td class="border px-4 py-2">${task.name}</td>
            <td class="border px-4 py-2">${task.start.date} (${task.start.day})</td>
            <td class="border px-4 py-2">${task.start.time}</td>
            <td class="border px-4 py-2">${task.end.date} (${task.end.day})</td>
            <td class="border px-4 py-2">${formatTimeToHHMMSS(task.totalTime)}</td> <!-- Display Total Time as "Time Spent" -->
          </tr>
        `).join('');
      }
  
    document.getElementById('startStopBtn').addEventListener('click', startTimer);
    document.getElementById('stopBtn').addEventListener('click', stopTimer);
  });
  
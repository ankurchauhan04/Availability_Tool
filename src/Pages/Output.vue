<template>
  <div style="height: 100%; background-color: #ede7f6" class="d-flex">




    <!-- <v-card class="flex-grow-0 ma-10 pa-5" width="400px" rounded="10">
      <span>Availability Schedule</span>
      <p v-for="(day, index) in weeks" :key="index">
        <span class="headline">{{ days[index] }}: </span
        ><span v-for="(time, i) in day" :key="i">
          <v-chip class="ma-2" v-if="time.start"
            ><span>{{ time.start }} to {{ time.end }}</span></v-chip
          ></span
        >
      </p>
    </v-card> -->



    <v-card class="flex-grow-2 ma-10 pa-5" rounded="10">
      <span class="headline">Enter your schedule according to Indian Standard Time</span>
      <v-row>
          <v-col cols="12" sm="6" md="2">Days</v-col>
          <v-col cols="12" sm="6" md="4" class="ml-15">Start Date</v-col>
          <v-col cols="12" sm="6" md="4" class="ml-n9">End Date</v-col>
          <v-col cols="12" sm="6" md="2" class="ml-n13">Leaves</v-col>
        </v-row>
      <v-form v-for="(day, index) in display_weeks" :key="index">
        
        <v-row>
          <v-col cols="12"
        sm="6"
        md="3">
            <span class="title">{{ days[index] }}: </span>
          </v-col>
          <v-col cols="12" md="4" class="pr-n15">
        <v-menu
          ref="menu1"
          v-model="menu1[index]"
          :close-on-content-click="false"

          :return-value.sync="display_weeks[index].time.start"
          transition="scale-transition"
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="display_weeks[index].time.start"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
              class="mt-n2"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menu1[index]"
            v-model="display_weeks[index].time.start"
            
            format="24hr"
            @click:minute="$refs.menu1[index].save(display_weeks[index].time.start)"
          ></v-time-picker>
        </v-menu>
      </v-col>
      <v-col cols="12"
        sm="6"
        md="4" class="ml-n10">
        <v-menu
          ref="menu2"
          v-model="menu2[index]"
          :close-on-content-click="false"
          :return-value.sync="display_weeks[index].time.end"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
            width="2000px"
              v-model="display_weeks[index].time.end"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
              class="mt-n2"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menu2[index]"
            v-model="display_weeks[index].time.end"
            full-width
            :min="display_weeks[index].time.start"
            format="24hr"
            @click:minute="$refs.menu2[index].save(display_weeks[index].time.end)"
          ></v-time-picker>
        </v-menu>
      </v-col>
      <v-col cols="12"
        sm="6"
        md="1" class="ml-n10"
        >
      <v-checkbox label="Leave" v-model="leave[index]"></v-checkbox>
      </v-col>
        </v-row>
      </v-form>
        <v-btn color="success" @click="getData().then(() => availability())">Go</v-btn>
    </v-card>

    <v-divider class="pa-5" vertical inset></v-divider>


    <v-card class="flex-grow-1 transparent" >
    <v-card height="230px" width="500px" class="ma-auto">
      <v-card-title class="headline">
        <p class="text-center">Availability Status</p>
        <v-spacer></v-spacer>
        <v-select    
          v-model="timeZone"
          :items="timeZones"
          label="TimeZone"
          outlined
          dense
          @change="getData().then(() => availability())"
          class="select"
        ></v-select>
      </v-card-title>

      <v-card-actions class="ml-3">
        <v-progress-linear
          v-if="percentage == 100"
          v-model="percentage"
          color="green"
          class="mt-3 mr-8"
        ></v-progress-linear>
        <v-progress-linear
          v-if="percentage != 100"
          v-model="percentage"
          color="red"
          class="mt-3 mr-8"
        ></v-progress-linear>
        
        <v-spacer></v-spacer>
        <v-btn text color="success" v-if="available">
          Available Now
        </v-btn>
        <span  class="text-button error--text"  v-if="!available">
          Unavailable
        </span>
      </v-card-actions>
      <p class="ml-6 caption text-left" v-if="!available">
        <span class="subtitle-1">Will be available after</span>
        <span class="subtitle-1" v-if="leave.indexOf(false) == -1"> a week</span><br> 
        <span v-if="day && hh && leave.indexOf(false) != -1"><span class="headline">{{ day }}</span> days <span class="headline">{{ hh }}</span> hours </span>
        <span v-if="day && !hh && leave.indexOf(false) != -1"><span class="headline">{{ day }}</span> days </span>
        <span v-if="!day && hh && mm && leave.indexOf(false) != -1"><span class="headline">{{ hh }}</span> hours <span class="headline">{{ mm }}</span> minutes </span>
        <span v-if="!day && hh && !mm && leave.indexOf(false) != -1"><span class="headline">{{ hh }}</span> hours </span>
        <span v-if="!day && !hh && leave.indexOf(false) != -1"><span class="headline">{{ mm }}</span> minutes <span class="headline">{{ seconds }}</span> seconds </span>
      </p>
      
      </v-card>
    </v-card>
  </div>
</template>

<script>
import { db } from "@/main";
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      menu1: [false,false,false,false,false,false,false],
      menu2: [false,false,false,false,false,false,false],
      leave: [false,false,false,false,false,false,false],
      holidays: ["11/10/2020"],
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thrusday",
        "Friday",
        "Saturday",
      ],
      timeZones: [
        "America/New_York",
        "Asia/Shanghai",
        "Australia/Brisbane",
        "Asia/Kolkata",
        "Asia/Jerusalem",
        "Africa/Nairobi",
        "Asia/Tehran",
        "Asia/Dubai",
        "Asia/Karachi",
        "Asia/Kathmandu"
      ],
      timeZone: "Asia/Kolkata",
      keys: [],
      times: [],
      day: 0,
      available: true,
      hh: null,
      mm: null,
      percentage: null,
      weeks: null,
      display_weeks:null,
      count : 0,
      seconds : 60,
      dayCount : true,
      leaveCount : 0
    };
  },
 
  created() {
    this.weeks = JSON.parse(JSON.stringify(this.original_weeks))
    this.display_weeks = JSON.parse(JSON.stringify(this.original_weeks))
    this.getData().then(() => this.availability());
    this.timeOut()
    
  },


  computed:{
    ...mapGetters({
      original_weeks: 'time/getData'
    }),
  },

  methods: {
    dateFormat(date){
      return date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()
    },

    consecutiveLeave(day){
      
      for(let i = day ; i+1 != day; i=i%7){
        if(this.leave[i] == this.leave[(i+1)%7]){
          this.leaveCount += 1;
          i++;
        }
        else{
          return this.leaveCount 
        }
      }
    },

    consecutiveDates(day){
      let nextDay = this.nextDay(day)
      let nextDate = this.dateFormat(nextDay)
      if(this.holidays.indexOf(nextDate) !== -1){
        this.count += 1;
        this.count = this.consecutiveDates(nextDay)
        
      }
      else{
        return this.count;
      }
      return this.count
    },
    
    nextDay(date){
      let day = new Date(date);

      var nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      return nextDay;
    },
    timeOut(){
      var that = this;
      setInterval(function(){that.seconds = that.seconds-1}, 1000)
      setInterval(function(){that.getData().then(() => that.availability())}, 60000);
      
    },
    availability() {
      this.seconds = 60
      let currentDay = new Date();
      let fullDate = this.dateFormat(currentDay)
      console.log(fullDate)
      let nextDay = this.nextDay(currentDay)
      let nextDate = this.dateFormat(nextDay)
      console.log("current Date=========>",nextDate)


      

      let date = new Date(
        new Date().toLocaleString("en-US", { timeZone: `${this.timeZone}` })
      );

      let hours = date.getHours().toString().length == 1? "0" + date.getHours() : date.getHours();
      let minutes = date.getMinutes().toString().length == 1? "0" + date.getMinutes() : date.getMinutes();
      console.log("ankur--------->", date.getHours(), date.getMinutes());
      let time = hours + ":" + minutes;
      console.log(this.days[date.getDay()]);
      var dayObj = this.weeks[date.getDay()];

      for (let i in dayObj) {
        if(dayObj[i]["end"].split(":")[0].length == 1 ){
          var endHour = "0" + dayObj[i]["end"].split(":")[0]
        }
        else{
          var endHour = dayObj[i]["end"].split(":")[0]
        }
        if(dayObj[i]["end"].split(":")[1].length == 1 ){
          var endMinute = "0" + dayObj[i]["end"].split(":")[1]
        }
        else{
          var endMinute = dayObj[i]["end"].split(":")[1]
        }
        let endTime = endHour +":"+ endMinute
        console.log("currentTime------------>",time , endTime,dayObj[i]["start"]);

        

        if (time >= dayObj[i]["start"] && time <= endTime && this.holidays.indexOf(fullDate) == -1 && this.leave[date.getDay()] == false) {          
          this.percentage = 100;
          this.available = true;
          if (this.available) {
            break;
          }
        } 
        else {
          this.available = false;
          if(this.leave[date.getDay()+1]==true){
            var leaves = this.consecutiveLeave(date.getDay())
            var dayObj = this.weeks[(date.getDay() + leaves + 1)%7]
          }

          if(this.holidays.indexOf(fullDate) !== -1){
              
                let day = this.consecutiveDates(fullDate)
                let x = (day + currentDay.getDay()+2)%7
                var dayObj = this.weeks[x];
            }


          console.log("time------->",dayObj,"-",date.getHours(),":",date.getMinutes())
          let hourDifference = dayObj[i]["start"].split(":")[0] - date.getHours();
          let minuteDifference = dayObj[i]["start"].split(":")[1] - date.getMinutes();
          console.log("hour difference",hourDifference,minuteDifference)
          if (hourDifference >= 0) {

            if(this.holidays.indexOf(fullDate) !== -1){
              
                this.day = this.consecutiveDates(nextDay)
                this.day += 1;
            }
            if(this.leave[date.getDay()+1]==true){
              this.day = leaves
            }
            if(hourDifference == 0){
              this.hh = hourDifference;
            }
            else{
              this.hh = minuteDifference < 0 ? hourDifference - 1 : hourDifference;
            }
            this.mm = minuteDifference < 0 ? 60 + minuteDifference : minuteDifference;
            if(hourDifference == 0){
              console.log(hourDifference)
              var hourDiff =
              parseInt(dayObj[i]["start"].split(":")[0]);
              var minuteDiff =
              parseInt(dayObj[i]["start"].split(":")[1])
            }
            else{
              if(dayObj.hasOwnProperty('123')){
                var hourDiff =
                parseInt(dayObj[i]["start"].split(":")[0]) -
                parseInt(dayObj['123']["end"].split(":")[0]);
                var minuteDiff =
                parseInt(dayObj[i]["start"].split(":")[1]) -
                parseInt(dayObj['123']["end"].split(":")[1]);
              }
              else{
                console.log("asdfadsfdsa",parseInt(dayObj[i]["start"].split(":")[0]) ,"-", parseInt(dayObj['time']["end"].split(":")[0]))
                var hourDiff = parseInt(dayObj['time']["end"].split(":")[0]);
                var minuteDiff = parseInt(dayObj['time']["end"].split(":")[1]);
                console.log(hourDiff, minuteDiff)
              }
              
            }
            let hr = minuteDiff < 0 ? hourDiff - 1 : hourDiff;
            let min = minuteDiff < 0 ? 60 + minuteDiff : minuteDiff;
            let totalHour = hr + min / 60;
            let totalMinute = min % 60;
            let totalTime = (this.day*24 + totalHour) + totalMinute / 60;
            let timeLeft = (this.day*24 + this.hh) + this.mm / 60;
            this.percentage = ((totalTime - timeLeft) / totalTime) * 100;
            console.log("percentage", this.percentage,timeLeft, totalTime)
          } else {
            let hour1 = 24 - date.getHours();
            let minute1 = 59 - date.getMinutes();
            if(date.getDay() == 6){
              var dayObject = this.weeks[0];
            }
            else if(this.holidays.indexOf(nextDate) !== -1){
              this.day = this.consecutiveDates(nextDay)
              let x = (this.day + currentDay.getDay() + 2)%7
              var dayObject = this.weeks[x];
              this.day += 1
            }
            else if(this.leave[date.getDay()+1]==true){
              this.day = leaves
              var dayObject = this.weeks[date.getDay() + leaves + 1]
              if(date.getDay() + leaves + 1 >= 7){
                var dayObject = this.weeks[(date.getDay() +leaves + 1)%7]
              }
            }
            else{
              var dayObject = this.weeks[date.getDay() + 1];
            }
            console.log("dayObj",dayObject)
            for (let i in dayObject) {
              var hour2 = dayObject[i]["start"].split(":")[0];
              var minute2 = dayObject[i]["start"].split(":")[1];
            }
            let totalHour = 24 - parseInt(dayObj[i]["end"].split(":")[0]) + parseInt(hour2);
            let totalMinute = parseInt(minute2) - parseInt(dayObj[i]["end"].split(":")[1]);
            totalHour = totalHour + totalMinute / 60;
            totalMinute = totalMinute % 60;
            let totalTime = (this.day*24 + totalHour) + (totalMinute / 60);

            let min = parseInt(minute1) + parseInt(minute2);
            let hr = parseInt(hour1) + parseInt(hour2);
            this.hh = parseInt(hr + min / 60);
            this.mm = min % 60;
            console.log("------------------->",this.hh,":",this.mm)
            let timeLeft = (this.day*24 + this.hh) + (this.mm / 60);
            console.log("timeLeft",timeLeft,totalTime)
            this.percentage = ((totalTime - timeLeft) / totalTime) * 100;
            if(this.hh >= 24){
              this.hh = this.hh - 24;
              this.day += 1; 
              console.log(this.day)
            }
              if(this.percentage < 0){
                this.percentage = this.percentage * -1
              }
          }
        }
      }
    },

    getTime(timeObj, day, timeKey) {
      for (let i in timeObj) {
        var time = this.addDifference(timeObj[i]);
        var hrs = time[0];
        var mins = time[1];
        if (hrs.toString().length == 1) {
          hrs = "0" + hrs;
        }
        if (mins.toString().length == 1) {
          mins = "0" + mins;
        }
        this.weeks[day][timeKey][i] = hrs + ":" + mins;
      }
    },

    getFinalTime(timeObj, day, timeKey) {
      for (let i in timeObj) {
        var convertedTime = [];
        var splitTime = timeObj[i].split(":");

        var hrs = splitTime[0];
        var mins = splitTime[1];
        if (hrs >= 24) {
          var hours = hrs - 24,
            newEntry = {
              start: "00:00",
              end: hours + ":" + mins,
            };
          if (day == 6) {
            this.weeks[0][123] = newEntry;
          } else {
            this.weeks[parseInt(day) + 1][123] = newEntry;
          }
          hrs = 23;
          mins = 59;
          this.weeks[day][timeKey][i] = hrs + ":" + mins;
        }
      }
    },

    removeTime(timeObj, day, timeKey) {
      for (let i in timeObj) {
        if (timeObj["start"] == "23:59") {
          this.weeks[day][timeKey][i] = null;
        }
      }
    },

    addDifference(time) {
      var convertedTime = [];
      var splitTime = time.split(":");
      var hrs = parseInt(splitTime[0]) + parseInt(this.hours);
      var mins = parseInt(splitTime[1]) + parseInt(this.minutes);
      hrs = parseInt(hrs + mins / 60);
      convertedTime.push(hrs);
      mins = mins % 60;
      convertedTime.push(mins);
      return convertedTime;
    },

    difference() {
      var date1 = new Date(
        new Date().toLocaleString("en-US", { timeZone: `${this.timeZone}` })
      );
      var date2 = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Calcutta" })
      );
      var diff = date2.getTime() - date1.getTime();
      this.hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= this.hours * (1000 * 60 * 60);
      this.minutes = Math.floor(diff / (1000 * 60));
      diff -= this.minutes * (1000 * 60);
      console.log("Time:", this.hours + ":" + this.minutes);
    },

    async getData() {
      this.count = 0;  
      this.day = 0,
      this.leaveCount = 0
      this.weeks = JSON.parse(JSON.stringify(this.original_weeks))
    
      this.difference();


      for (let i in this.display_weeks ) {
        for (let j in this.display_weeks[i]) {
          this.getTime(this.display_weeks[i][j], i, j);
        }
      }


      for (let i in this.weeks) {
        for (let j in this.weeks[i]) {
          this.getFinalTime(this.weeks[i][j], i, j);
        }
      }

      
      for (let i in this.display_weeks) {
        for (let j in this.display_weeks[i]) {
          this.removeTime(this.display_weeks[i][j], i, j);
        }
      }
    },
  },
};
</script>

<style scoped>
.v-input__slot {
  min-height: 20px !important;
}
.v-input{
   max-width:50%;   
}
</style>
<template>
  <v-form>
    {{ day + time1 }} {{x}}
    <v-select :items="items" v-model="day"></v-select>
    <v-row>
      <v-col>
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="time1"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time1"
              label="Pick start date"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menu1"
            v-model="time1"
            full-width
            format="24hr"
            @click:minute="$refs.menu1.save(time1)"
          ></v-time-picker>
        </v-menu>
      </v-col>
      <!-- <v-spacer></v-spacer> -->
      <v-col>
        <v-menu
          ref="menu2"
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="time2"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time2"
              label="Pick end date"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menu2"
            v-model="time2"
            full-width
            format="24hr"
            @click:minute="$refs.menu2.save(time2)"
          ></v-time-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-menu
          ref="leave"
          v-model="leave"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="time2"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time2"
              label="Pick end date"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="leave"
            v-model="time2"
            full-width
            format="24hr"
            @click:minute="$refs.leave.save(time2)"
          ></v-time-picker>
        </v-menu>
    <v-btn @click="submit" color="success"> submit </v-btn>
  </v-form>
</template>

<script>
import { db } from '@/main'
export default {
  data() {
    return {
      time1: null,
      time2: null,
      menu1: false,
      menu2: false,
      leave: false,
      day: null,
      items: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thrusday",
        "Friday",
        "Saturday",
        "Sunday",
      ],

      x: null
    };
  },
  methods:{
    // addDifference(time,hours,minutes){
    //   var splitTime = time.split(':')
    //   var hrs = parseInt(splitTime[0]) + parseInt(hours)
    //   var mins = parseInt(splitTime[1]) + parseInt(minutes)
    //   hrs = parseInt(hrs + mins/60)
    //   mins = mins%60;
    //   console.log(hrs+":"+mins)
    // },
      submit(){
          
          // console.log(this.day)
          switch(this.day){
            case "Sunday":
              this.id = 0
              break;
            case "Monday":
              this.id = 1
              break;
            case "Tuesday":
              this.id = 2
              break;
            case "Wednesday":
              this.id = 3
              break;
            case "Thrusday":
              this.id = 4
              break;
            case "Friday":
              this.id = 5
              break;
            case "Saturday":
              this.id = 6
              break;
          }
          console.log(this.id)
          db.ref(`availability/weeks/${this.id}/${Date.now()}`).set({
            start: this.time1,
            end: this.time2
          })
            
          
    //       console.log('America --------> ', new Date( new Date().toLocaleString("en-US", {timeZone: "America/New_York"})).toLocaleString())
    //       console.log('India ----------> ', new Date().toLocaleString())

    //   var date1 =  new Date(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}));
    //   var date2 = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Calcutta"}));
    //   console.log(this.items[date1.getUTCDay()])
    //   var diff =(date2.getTime() - date1.getTime()) ;
    //   var hours = Math.floor(diff / (1000 * 60 * 60));
    //   diff -= hours * (1000 * 60 * 60);
    //   var minutes = Math.floor(diff / (1000 * 60));
    //   diff -= minutes * (1000 * 60);
    
    // console.log("Time:",hours +":"+minutes)
    // console.log('start date ------>',this.time1)
    // console.log('end date -------->',this.time1)
    // this.addDifference(this.time1,hours,minutes)
    // this.addDifference(this.time2,hours,minutes) 
      }
  }
};
</script>
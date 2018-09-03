import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Events } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import firebase from 'firebase/app';

/**
 * Generated class for the RegisterUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-user',
  templateUrl: 'register-user.html',
})
export class RegisterUserPage {

  users = [];
  numberOfValues = [];
  changeGos = []

  constructor(public navCtrl: NavController, public navParams: NavParams,public dataProvider : AlertProvider,public alertCtrl:AlertController,public events:Events) {
    this.users = [];
    this.dataProvider.getNewUser(this.users);
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&");
    console.log(this.users);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterUserPage');
    
  }


  ionViewWillLeave(){
    this.dataProvider.getVariousTypeGo(this.changeGos);
    this.events.publish('gos:changed',this.changeGos);
    console.log("---------------registerAfterGos-------------------------");
    console.log(this.changeGos);
    
  };
  register(user,key,username,state_package){
    console.log(user);
    var setPackage = '';
    if(state_package == '0'){
        setPackage = '2';
    } else {
      setPackage = '3';
    }


    
    this.dataProvider.moveMember(user,setPackage,username,key);
    
    this.dataProvider.registerGOs(user);
    this.dataProvider.numbersAfterExpire(this.numberOfValues);

    this.events.publish('user:created',this.numberOfValues);


    var indexDate = [];this.dataProvider.returnIndex(indexDate);
    
    var indexGo = indexDate[0];

    // console.log(indexGo);
    // console.log(key);

  //  the totoalGo is set to the first purchase go
    var registerGoIndex = Object.keys(user.GO)[0];  
    var val = user.GO[registerGoIndex]; 
    var totoalGo = val.amount; 

    var todayDate = new Date();
    var dd = todayDate.getDate();
    var strdd = dd.toString();
    var mm = todayDate.getMonth()+1; //January is 0!
    var strmm = mm.toString();

    var yyyy = todayDate.getFullYear();
    if(dd<10){
      strdd='0'+strdd;
    } 
    if(mm<10){
      strmm='0'+strmm;
    } 
    var dayKey = strdd + '-' + strmm + '-' + yyyy;
    var rewardsDate = strdd + '/'  +strmm + '/' + yyyy;

    firebase.database().ref().child('/user/' + key).update({

      state_package: setPackage,
      referralID_mine: username+key,
      date_start:rewardsDate,



      }).then(function() {
        // Update successful.
        // Remove the record of registerd users in  the notification/sign 

          firebase.database().ref().child('/notification/sign/'+user.key1).remove().then(function() {
            console.log("SUCCESS");

          });

        // when the new user is registered, set the totoalGo is set to the first purchase go
          firebase.database().ref().child('/user/' + key + '/GO').update({
          
            totoalGO:totoalGo,

          })




          firebase.database().ref().child('/user/' + key + '/GO/' + indexGo).update({

            state_complete:'1',
            date:rewardsDate,

          }).then(function() {
         
            var hidden = document.getElementById(user.key1);
            hidden.innerHTML = "Registered";

            });

      }, function(error) {
        // An error happened.
        console.log(error);
      });

     
  }

}

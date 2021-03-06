const http = require('http');
const express = require('express');
const io = require('socket.io');
const Abletonlink = require('abletonlink');

const Server = {
  http: null,
  io: null,
  link: null,
  lastBeat: 0,
  numPeers: 0,
  port: null,
  async start({ port = 0 } = {}){

    const app = express();

    Server.http = http.createServer(app);
    Server.io = io(Server.http);

    Server.link = new Abletonlink(0, 4.0, true);

    Server.io.on('connection', (client) => {

      console.log('Client connected', client.conn.remoteAddress);
      client.emit('numPeers', Server.numPeers);

      client.on('disconnect', () => {

        console.log('Client disconnected', client.conn.remoteAddress);

      });

    });

    Server.link.on('numPeers', (numPeers) => {

      Server.numPeers = numPeers;
      console.log('NumPeers', numPeers);
      Server.io.emit('numPeers', Server.numPeers);

    });

    Server.link.startUpdate(100, (beat, phase, bpm) => {

      //console.log(`beat ${beat} phase ${phase} bpm ${bpm}`);

      const beatInt = Math.floor(beat);
      if((beatInt - Server.lastBeat) <= 0) return;
      Server.lastBeat = beatInt;

      const bps = bpm / 60;
      const phaseDecimal = phase - Math.floor(phase);
      const phaseMillisecond = phaseDecimal/bps;
      const beatStartTime = Date.now() - phaseMillisecond;

      if(Server.numPeers > 0){

        Server.io.emit('beat', { bpm, bps, beat: beatInt, phase: phaseDecimal, beatStartTime});
        // console.log(`New beatInt ${beatInt} beatStartTime ${beatStartTime} phaseDecimal ${phaseDecimal} bps ${bps}`);

      }

    });

    return new Promise((resolve) => {

      Server.http.listen(port, () => {

        Server.port = Server.http.address().port;
        console.log(`AbletonLink proxy listen on localhost:${Server.port}`);
        resolve();

      });

    });


  },
  async stop(){

  }
};

module.exports = Server;

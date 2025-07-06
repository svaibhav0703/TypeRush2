const rooms = [];

const generateUniqueRoomCode = (rooms) => {
  let roomCode;
  do {
    roomCode = Math.ceil(Math.random() * 10000);
  } while (rooms.find((ele) => ele.roomCode == roomCode));
  return roomCode;
};

const addRoom = (roomCode, userName, socket) => {
  rooms.push({
    roomId: roomCode,
    isGameActive: false,
    host: socket.id,
    players: [{ socketId: socket.id, playerName: userName, isReady: true }],
    result: [],
    difficulty: "easy", // initially
    time: 15, // initially
    text: "", // initially
  });
};

const getHostName = (roomId) => {
  const room = rooms.find((ele) => String(ele.roomId) === String(roomId));
  if (!room) {
    console.log("no room found");
    return null;
  }
  const hostPlayer = room.players.find(
    (player) => String(player.socketId) === String(room.host)
  );
  return hostPlayer ? hostPlayer.playerName : null;
};

const joinRoom = (roomId, socketId, playerName) => {
  const room = rooms.find((ele) => Number(ele.roomId) === Number(roomId));
  if (!room) return { success: false, reason: "not_found" };
  if (room.players.length > 3) return { success: false, reason: "full" };

  room.players.push({
    socketId,
    playerName,
    isReady: false,
  });

  return { success: true, room };
};

const getRoomData = (roomCode) => {
  const room = rooms.find((ele) => String(ele.roomId) === String(roomCode));
  return room;
};

const changeSettings = (roomCode, duration, difficulty) => {
  const room = rooms.find((ele) => Number(ele.roomId) === Number(roomCode));
  if (!room) {
    console.log("No room found");
    return null;
  }
  room.time = Number(duration);
  room.difficulty = String(difficulty);
};

const deleteRoom = (roomCode) => {
  const roomInd = rooms.findIndex(
    (ele) => String(ele.roomId) === String(roomCode)
  );
  if (roomInd !== -1) {
    rooms.splice(roomInd, 1); // removes the room at roomInd
  }
};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`); // this is for a connection to form between the socket aand the server

    socket.on("createRoom", (userName) => {
      let roomCode = generateUniqueRoomCode(rooms);
      addRoom(roomCode, userName, socket);
      socket.join(Number(roomCode));
      console.log(socket.id, " joined ", Number(roomCode));
      socket.emit("roomCreated", { roomCode, host: userName });
    });

    socket.on("getRoomData", (roomCode) => {
      const room = getRoomData(roomCode);
      console.log(room);
      socket.emit("roomData", room);
    });

    socket.on("joinRoom", (data) => {
      const { code, playerName } = data;
      const result = joinRoom(code, socket.id, playerName);
      if (!result.success) {
        if (result.reason === "not_found") {
          socket.emit("RoomDoesNotExists", { message: "room does not exist" });
          return;
        }
        if (result.reason === "full") {
          socket.emit("RoomDoesNotExists", { message: "room is full" });
          return;
        }
      } else {
        // room joined ;
        socket.join(Number(code)); // groups all sockets of the group together
        console.log(socket.id, " joined ", Number(code));
        const host = getHostName(code);

        socket.emit("roomJoined", { code, playerName, host });
        const newRoomData = getRoomData(code);
        console.log(newRoomData);
        io.to(Number(code)).emit("updateRoom", {
          newRoomData,
          message: `${playerName} Joined`,
        });
      }
    });

    socket.on("settingsChange", (data) => {
      const { roomCode, Duration, difficulty } = data;
      changeSettings(roomCode, Duration, difficulty);
      const newRoomData = getRoomData(roomCode);

      io.to(Number(roomCode)).emit("settingsChanged", newRoomData);
    });

    socket.on("playerReady", (roomCode) => {
      const room = getRoomData(roomCode);
      if (room.isGameActive) return; // if the game is active then the player cannot unready
      const players = rooms.find(
        (ele) => Number(ele.roomId) === Number(roomCode)
      ).players;

      const player = players.find(
        (ele) => String(ele.socketId) === String(socket.id)
      );
      player.isReady = !player.isReady;
      const newRoomData = getRoomData(roomCode);
      io.to(Number(roomCode)).emit("updateRoom", {
        newRoomData,
        message: `${player.playerName} is ${player.isReady ? "" : "not"} ready`,
      });
    });

    socket.on("playerLeaving", (roomCode) => {
      const room = getRoomData(roomCode);
      if (!room) console.log("no room found");
      console.log(socket.id, " left ", roomCode);
      socket.leave(Number(roomCode));
      // other is leaving
      const playerInd = room.players.findIndex(
        (ele) => String(ele.socketId) === String(socket.id)
      );
      if (playerInd === -1) {
        console.log("player not found in room");
        return;
      }
      const playerName = room.players[playerInd].playerName;
      room.players.splice(playerInd, 1); // removing the player from the room

      if (
        !room.result.find((ele) => ele.playerName === playerName) &&
        room.isGameActive
      ) {
        room.result.push({
          socketId: socket.id,
          playerName,
          speed: 0,
          accuracy: 0,
        });
      }
      if (!room.players.length) {
        console.log(roomCode, "deleted");

        deleteRoom(roomCode);
        console.log(rooms);
        return;
      }
      if (room.host === socket.id) {
        // the host is leaving
        room.host = room.players[0].socketId;
        room.players[0].isReady = true;
      }

      const newRoomData = getRoomData(roomCode);
      socket.to(Number(roomCode)).emit("updateRoom", {
        newRoomData,
        message: `${playerName} Left`,
      });
    });

    socket.on("startRequested", (roomCode) => {
      const room = getRoomData(roomCode);
      const NotReady = room.players.find((ele) => ele.isReady === false);
      console.log(NotReady);
      if (NotReady) {
        io.to(Number(roomCode)).emit("updateRoom", {
          room,
          message: `${NotReady.playerName} is not Ready`,
        });
      } else {
        room.isGameActive = true;
        const newRoomData = getRoomData(roomCode);
        io.to(Number(roomCode)).emit("updateRoom", {
          newRoomData,
          message: "Get Ready",
        });
        io.to(Number(roomCode)).emit("roomStarted");
      }
    });

    socket.on("textChange", ({ text, roomCode }) => {
      const room = getRoomData(roomCode);
      room.text = text;
      const newRoomData = getRoomData(roomCode);
      io.to(Number(roomCode)).emit("textChanged", newRoomData);
    });

    socket.on("submitTest", ({ roomCode, currScore, playerName, userId }) => {
      const room = getRoomData(roomCode);

      room.result.push({ socketId: socket.id, playerName, currScore, userId });
      const newRoomData = getRoomData(roomCode);
      socket.emit("testSubmitted", newRoomData);
      io.to(Number(roomCode)).emit("updateRoom", {
        newRoomData,
        message: "",
      });
    });
    socket.on("rematch", (roomCode) => {
      const room = getRoomData(roomCode);
      const player = room.players.find((ele) => ele.socketId === socket.id);
      room.result = [];
      room.text = "";
      room.isGameActive = false;
      if (player.socketId !== room.host) player.isReady = false;
      const newRoomData = getRoomData(roomCode);
      io.to(Number(roomCode)).emit("updateRoom", {
        newRoomData,
        message: "",
      });
    });
  });
};

export default socketHandler;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = exports.MainApp = void 0;
const types_1 = require("./types");
const User_1 = require("./User");
const RoomState_1 = require("./RoomState");
class MainApp {
    constructor() {
        // Коллекция пользователей онлайн.
        this.users = [];
        // Здесь хранятся состояния комнат.
        this.rooms = new Map();
        this.rooms.set(types_1.Room.Light, new RoomState_1.RoomState(types_1.Room.Light));
        this.rooms.set(types_1.Room.Dark, new RoomState_1.RoomState(types_1.Room.Dark));
    }
    isUserOnline(id) {
        return this.findUsersById(id).length !== 0;
    }
    findUsersById(id) {
        return this.users.filter(item => item.id === id);
    }
    findUsersByRoom(room) {
        return this.users.filter(item => item.room === room);
    }
    // Зарегистрировать юзера онлайн.
    setUserOnline(userData) {
        let user = new User_1.User(userData.id, userData.name);
        this.users.push(user);
    }
    updateUserState(userData) {
        if (this.isUserOnline(userData.id)) {
            // var users: UserState[]
            var users = this.findUsersById(userData.id);
            var user = users[0];
            if (typeof (userData.role) === undefined) {
                user.role = types_1.UserRole.Estimator;
            }
            else {
                user.role = userData.role;
            }
        }
        else {
            var newItem = new User_1.User(userData.id, userData.name, userData.role, userData.room);
            this.users.push(newItem);
        }
    }
    setUserMark(userId, newMark) {
        var tempUsers = this.findUsersById(userId);
        if (tempUsers.length !== 0) {
            tempUsers[0].mark = newMark;
        }
    }
    clearMarks(room) {
        var roomState = this.rooms.get(room);
        if (roomState instanceof RoomState_1.RoomState) {
            roomState.marksVisible = false;
        }
        // Очищаем оценку людям в этой комнате
        var tempUsers = this.findUsersByRoom(room);
        tempUsers.forEach((element) => {
            element.mark = undefined;
        });
    }
    handleClientTick(reqBody) {
        var userId = reqBody.userId;
        var userName = reqBody.userName;
        var role = reqBody.userRole;
        var room = reqBody.room;
        if (!this.isUserOnline(userId)) {
            var userData = {
                id: userId,
                name: userName,
                role: role,
                room: room
            };
            this.setUserOnline(userData);
        }
        var users = [];
        var userIds = [];
        function roomFilter(element, index, array) {
            return (element.room === types_1.Room.Light);
        }
        var users1 = this.users.filter(roomFilter);
        console.log(users1);
        users1.forEach((element) => {
            var tempUser = {
                user: element.id,
                currentMark: element.mark,
                role: types_1.UserRole.Estimator
            };
            users.push(tempUser);
            userIds.push(element.id);
        });
        var currentRoomState = this.rooms.get(room);
        var marksVisible = (currentRoomState === null || currentRoomState === void 0 ? void 0 : currentRoomState.marksVisible) === undefined ? false : true;
        var roomState = {
            room: room,
            users: users,
            userIds: userIds,
            marksVisible: marksVisible,
        };
        var result = {
            time: new Date(),
            roomState: roomState
        };
        return result;
    }
    changeRole(userId, role) {
        var tempUsers = this.findUsersById(userId);
        if (tempUsers.length !== 0) {
            var user = tempUsers[0];
            // Меняем пользователю роль.
            user.role = role;
        }
    }
    reset() {
        this.users.splice(0);
        // Сбрасываем состояния комнат.
        for (let entry of this.rooms.entries()) {
            entry[1].reset();
        }
    }
    showMarks(room) {
        var roomState = this.rooms.get(room);
        if (roomState instanceof RoomState_1.RoomState) {
            roomState.marksVisible = true;
        }
    }
    changeRoom(userId, room) {
        var tempUsers = this.findUsersById(userId);
        if (tempUsers.length !== 0) {
            var user = tempUsers[0];
            // Меняем пользователю комнату.
            user.room = room;
        }
    }
}
exports.MainApp = MainApp;
exports.mainApp = new MainApp;
// setInterval(mainApp.getUsers, 5000)

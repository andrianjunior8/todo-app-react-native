import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Define types for task and state
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState<string>("");
  const [completedTasks, setCompletedTasks] = useState<number>(0);

  // Login handler
  const handleLogin = async () => {
    const storedUsername = "admin";
    const storedPassword = "password123";

    if (username === storedUsername && password === storedPassword) {
      await AsyncStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
    } else {
      Alert.alert("Error", "Invalid username or password");
    }
  };

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(loggedIn === "true");
    };

    checkLoginStatus();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    setUsername("");
    setPassword("");
    setIsLoggedIn(false);
  };

  // Add a task
  const addTask = () => {
    if (!taskInput.trim()) {
      Alert.alert("Error", "Task cannot be empty");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskInput,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskInput("");

    // Optionally, use PushNotification for reminders
    // setTimeout(() => {
    //   PushNotification.localNotification({
    //     title: "Task Reminder",
    //     message: `Don't forget your task: ${newTask.title}`,
    //   });
    // }, 5000); // 5-second delay
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        task.completed = !task.completed;
      }
      return task;
    });

    setTasks(updatedTasks);
    setCompletedTasks(updatedTasks.filter((task) => task.completed).length);
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(filteredTasks);
  };

  // Render individual task
  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text
        style={item.completed ? styles.completedTask : styles.taskText}
        onPress={() => toggleTaskCompletion(item.id)}
      >
        {item.title}
      </Text>
      <Button
        title="Delete"
        onPress={() => deleteTask(item.id)}
        color="#FF8383"
      />
    </View>
  );

  const totalTasks = tasks.length;

  // If not logged in, show login screen
  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View>
              <Text style={styles.title}>Welcome to TODO APP</Text>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text style={styles.titleLogin}>Login</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor={"#FFFFFF"}
                  value={username}
                  onChangeText={setUsername}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={"#FFFFFF"}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <Button title="Login" onPress={handleLogin} />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // After login, show task dashboard
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Dashboard</Text>
      <Text style={styles.taskText}>Total Tasks: {totalTasks}</Text>
      <Text style={styles.taskText}>Completed Tasks: {completedTasks}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        placeholderTextColor={"#FFFFFF"}
        value={taskInput}
        onChangeText={setTaskInput}
      />
      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
      />

      <Button title="Logout" onPress={handleLogout} color="#FF8383" />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#2E5077",
    gap: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#F6F4F0",
  },
  titleLogin: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#F6F4F0",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#F6F4F0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "#F6F4F0",
    width: "100%",
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    gap: 2,
    backgroundColor: "#79D7BE",
  },
  taskText: {
    fontSize: 16,
    color: "#F6F4F0",
  },
  completedTask: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "gray",
  },
});

export default App;

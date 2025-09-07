import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Flex,
  Progress,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState, useEffect, useRef } from "react";
import { lightTheme, darkTheme, funTheme } from "./themes";

function App({ setTheme }) {
  const [user, setUser] = useState(null);
  const [paragraph, setParagraph] = useState("");
  const [input, setInput] = useState("");
  const [mistakes, setMistakes] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [logs, setLogs] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const inputRef = useRef(null);

  // Fetch random English sentences
const fetchParagraph = async () => {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random/4");
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();

    const numSentences = Math.floor(Math.random() * 3) + 2;
    const selected = data.slice(0, numSentences);

    let text = selected.map((q) => q.quote).join(" ");

    // Lowercase everything, then capitalize first letter after . ! ? or start
    text = text
      .toLowerCase()
      .replace(/(^\s*[a-z])|([.!?]\s*[a-z])/g, (match) =>
        match.toUpperCase()
      );

    setParagraph(text);
    setInput("");
    setMistakes(0);
    setSpeed(0);
    setAccuracy(100);
    setStartTime(null);
  } catch (err) {
    console.error("Failed to fetch paragraph:", err);
    setParagraph("Error loading paragraph. Please try again.");
  }
};


  useEffect(() => {
    fetchParagraph();
  }, []);

  // Handle typing input
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    // Count mistakes
    let errors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== paragraph[i]) errors++;
    }
    setMistakes(errors);

    // Live accuracy
    if (value.length > 0) {
      const correctChars = value.length - errors;
      const acc = ((correctChars / value.length) * 100).toFixed(2);
      setAccuracy(Number(acc));
    } else {
      setAccuracy(100);
    }

    // Update speed
    if (startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const wordsTyped = value.trim().split(/\s+/).length;
      setSpeed(Math.round(wordsTyped / elapsedMinutes));
    }

    // When finished typing
    if (value.length === paragraph.length) {
      const elapsedTime = (Date.now() - startTime) / 60000;
      const finalSpeed = Math.round(
        paragraph.trim().split(/\s+/).length / elapsedTime
      );

      const correctChars = value.length - errors;
      const finalAccuracy = ((correctChars / value.length) * 100).toFixed(2);

      const newLog = {
        speed: finalSpeed,
        mistakes: errors,
        accuracy: finalAccuracy,
        date: new Date().toLocaleString(),
      };
      setLogs((prev) => [newLog, ...prev]);
      fetchParagraph();
    }
  };

  // Guest login
  const handleGuest = () => {
    setUser({ displayName: "Guest" });
  };

  // Highlight paragraph with green/red + underline for next char
  const renderHighlightedText = () => {
    return paragraph.split("").map((char, idx) => {
      if (idx < input.length) {
        const correct = input[idx] === char;
        return (
          <span key={idx} style={{ color: correct ? "limegreen" : "crimson" }}>
            {char}
          </span>
        );
      }
      if (idx === input.length) {
        return (
          <span
            key={idx}
            style={{
              textDecoration: "underline",
              textDecorationColor: "dodgerblue",
            }}
          >
            {char}
          </span>
        );
      }
      return <span key={idx}>{char}</span>;
    });
  };

  return (
    <Box p={10} fontFamily="Roboto Mono, monospace">
      {/* Top bar with theme switcher */}
      <Flex justify="space-between" mb={6} align="center">
        <Heading size="lg">🚀 Typing Speed</Heading>
        <Menu>
          <MenuButton as={Button} colorScheme="blue" rightIcon={<ChevronDownIcon />}>
            Switch Theme
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setTheme(lightTheme)}>🌞 Light</MenuItem>
            <MenuItem onClick={() => setTheme(darkTheme)}>🌙 Dark</MenuItem>
            <MenuItem onClick={() => setTheme(funTheme)}>🎉 Pink</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <VStack spacing={6}>
        {!user ? (
          <Button size="lg" colorScheme="green" onClick={handleGuest}>
            Play as Guest
          </Button>
        ) : (
          <VStack spacing={6} w="100%">
            <Text fontSize="lg">Welcome, {user.displayName}!</Text>

            {/* Paragraph */}
            <Box
              border="1px solid #ccc"
              p={6}
              borderRadius="2xl"
              w="100%"
              maxW="700px"
              fontSize="18px"
              lineHeight="1.8"
              bg="whiteAlpha.50"
              boxShadow="md"
            >
              <Text as="div">{renderHighlightedText()}</Text>
              <Progress
                mt={4}
                value={(input.length / paragraph.length) * 100}
                colorScheme="blue"
                size="sm"
                borderRadius="lg"
              />
            </Box>

            {/* Typing box */}
            <Box
              as="textarea"
              ref={inputRef}
              value={input}
              onChange={handleChange}
              rows={5}
              placeholder="Start typing here..."
              sx={{
                width: "100%",
                maxWidth: "700px",
                border: "2px solid #3182ce",
                borderRadius: "12px",
                padding: "12px",
                fontSize: "16px",
                lineHeight: "1.6",
                backgroundColor: "#fefefe",
                _focus: {
                  outline: "none",
                  borderColor: "blue.400",
                  boxShadow: "0 0 8px rgba(49,130,206,0.6)",
                },
              }}
            />

            {/* Stats */}
            <HStack spacing={10} fontSize="lg">
              <Text>⏱ Speed: {speed} WPM</Text>
              <Text>❌ Mistakes: {mistakes}</Text>
              <Text
                color={
                  accuracy < 70 ? "red.400" : accuracy < 90 ? "orange.400" : "green.400"
                }
              >
                🎯 Accuracy: {accuracy}%
              </Text>
            </HStack>

            {/* Logs */}
            <Box w="100%" maxW="700px">
              <Heading size="md" mb={2}>
                📝 Your Logs
              </Heading>
              {logs.length === 0 ? (
                <Text>No logs yet.</Text>
              ) : (
                logs.map((log, index) => (
                  <Box
                    key={index}
                    border="1px solid #ddd"
                    p={3}
                    borderRadius="lg"
                    mb={2}
                    boxShadow="sm"
                  >
                    <Text>
                      Speed: {log.speed} WPM | Mistakes: {log.mistakes} | Accuracy:{" "}
                      {log.accuracy}% | Date: {log.date}
                    </Text>
                  </Box>
                ))
              )}
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}

export default App;


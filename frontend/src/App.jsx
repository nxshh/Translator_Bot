import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";

function App() {
  const [text, setText] = useState("");
  const [inputLang, setInputLang] = useState("en");
  const [outputLang, setOutputLang] = useState("fr");
  const [translation, setTranslation] = useState(null);

  const handleTranslate = async () => {
    if (!text) {
      alert("Please enter some text to translate!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          input_lang: inputLang,
          output_lang: outputLang,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTranslation(data);
      } else {
        alert(data.error || "Translation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, check console.");
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white"
    >
      <Card className="p-4 shadow-lg bg-black text-white w-75">
        <h2 className="text-center mb-4">Translator Chatbot</h2>

        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Input Language</Form.Label>
                <Form.Select
                  value={inputLang}
                  onChange={(e) => setInputLang(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="kn">Kannada</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>Output Language</Form.Label>
                <Form.Select
                  value={outputLang}
                  onChange={(e) => setOutputLang(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="kn">Kannada</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Enter Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something to translate..."
            />
          </Form.Group>

          <div className="text-center">
            <Button
              variant="danger"
              className="px-5"
              onClick={handleTranslate}
            >
              Translate
            </Button>
          </div>
        </Form>

        {translation && (
          <Card className="mt-4 bg-secondary text-white p-3">
            <h5>Input</h5>
            <p>
              <b>[{translation.input.input_lang}]</b>{" "}
              {translation.input.input_text}
            </p>
            <h5>Output</h5>
            <p>
              <b>[{translation.output.output_lang}]</b>{" "}
              {translation.output.output_text}
            </p>
          </Card>
        )}
      </Card>
    </Container>
  );
}

export default App;

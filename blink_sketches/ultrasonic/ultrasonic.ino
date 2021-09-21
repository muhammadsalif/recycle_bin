#include <WiFi.h>
#include <HTTPClient.h>

// defines pins numbers
#define trigPin 15
#define echoPin 14

// defines varia      bles
long duration;
int distance;

void setup() {

  Serial.begin(115200);
  Serial.println("\n... Starting ESP32 ...");

  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input

  WiFi.begin("techno", "12345678");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("...");
  }

  Serial.println("connected");
}

void loop() {
  delay(1000);
  // Clears the trigPin
  digitalWrite(trigPin, LOW);

  delayMicroseconds(5);

  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);

  delayMicroseconds(10);

  digitalWrite(trigPin, LOW);

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);

  Serial.print("Duration: ");
  Serial.println(duration);



  // Calculating the distance
  distance = duration * 0.034 / 2;


  // Prints the distance on the Serial Monitor
  Serial.print("Distance cm: ");
  Serial.println(distance);


  //Sending data to server


  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status

    HTTPClient http;

    http.begin("https://trash-recycling.herokuapp.com/dustbinlevel");  //Specify destination for HTTP request

    //    http.begin("http://192.168.43.192:5000/dustbinlevel");  //Specify destination for HTTP request

    //    http.addHeader("Content-Type", "text/plain");             //Specify content-type header
    //   int httpResponseCode = http.POST("request body in text formate");   //Send the actual POST request

    http.addHeader("Content-Type", "application/json");             //Specify content-type header

    String Sdistance = String(distance);
    int httpResponseCode = http.POST("{ \"dustbinId\" :  \"611e3ea04209765530fae5c4\" , \"distance\" : " + Sdistance + " ,  \"unit\" : \"cm\" }"); //Send the actual POST request

    if (httpResponseCode > 0) {

      String response = http.getString(); //Get the response to the request

      Serial.print("Status code :");      //Server status response code
      Serial.println(httpResponseCode);   //Print return code
      Serial.print("Server response:");   //Server response
      Serial.println(response);           //Print request answer

    } else {
      Serial.println("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    http.end();  //Free resources

  } else {
    Serial.println("Error in WiFi connection");
  }

  delay(2000);  //Send a request every 5 seconds

}

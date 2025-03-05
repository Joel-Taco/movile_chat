import React, { useState } from "react";
import { View, Button, Text, ActivityIndicator, Alert, Dimensions } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as XLSX from "xlsx";
import { BarChart } from "react-native-chart-kit";

const GEMINI_API_KEY = "AIzaSyDAGqH62t2MtCytFkHiC_r6k0ZH_MikiCo"; // 🔴 Reemplaza con tu API Key

export default function ExcelUploader() {
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<{ name: string; votes: number }[]>([]);
  const screenWidth = Dimensions.get("window").width;
  

  // Función para seleccionar el archivo Excel
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
      });

      if (result.canceled) return;

      const { uri } = result.assets[0];

      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const workbook = XLSX.read(fileContent, { type: "base64" });
      const sheetName = workbook.SheetNames[0]; // Tomar la primera hoja
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        Alert.alert("Error", "El archivo Excel está vacío.");
        return;
      }

      // Selecciona la primera fila automáticamente (ajustable según necesidad)
      setSelectedRow(jsonData);
      Alert.alert("Archivo Cargado", "Se ha seleccionado automáticamente la primera fila para análisis.");
    } catch (error) {
      console.error("Error al leer el archivo:", error);
      Alert.alert("Error", "No se pudo leer el archivo.");
    }
  };

  // Función para enviar los datos a la API de Gemini
  const sendToGemini = async () => {
    if (!selectedRow) {
      Alert.alert("Error", "No hay datos seleccionados para analizar.");
      return;
    }

    setLoading(true);
    setResponseText(null);

    try {
      const prompt = `La siguiente información son comentarios de personas sobre los candidatos a la presidencia del Ecuador, los posibles candidatos son Daniel Noboa y Luisa Gonzales. Debes identificar cuantos comentarios son a favor de cada candidato y si no logras identificar debes tomarlo como voto nulo. De respuesta únicamente dime cuantos son a favor de Daniel Noboa, Luisa Gonzales o Nulo en formato JSON:\n${JSON.stringify(selectedRow, null, 2)}`;

      const requestBody = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      });

      console.log("JSON enviado a Gemini:", requestBody); // Verifica antes de enviar

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      );

      const result = await response.json();

      console.log("Respuesta completa de Gemini:", JSON.stringify(result, null, 2)); // Verifica la respuesta
      
      const geminiResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No hay respuesta";

      console.log("Respuesta cruda de Gemini:", geminiResponse);

      // 🔹 Extraer solo el contenido JSON usando una expresión regular
      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No se encontró un JSON válido en la respuesta de Gemini");
      }

      const cleanedResponse = jsonMatch[0]; // Extrae el JSON encontrado

      console.log("JSON limpio extraído:", cleanedResponse);

      // Convertimos la respuesta en un objeto
      let parsedData;
      try {
        parsedData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Error al parsear la respuesta de Gemini:", parseError);
        Alert.alert("Error", "La respuesta de Gemini no es un JSON válido.");
        return;
      }

      setChartData([
        { name: "Daniel Noboa", votes: parsedData["Daniel Noboa"] || 0 },
        { name: "Luisa Gonzales", votes: parsedData["Luisa Gonzales"] || 0 },
        { name: "Nulos", votes: parsedData["Nulo"] || 0 }
      ]);
      

      setResponseText(cleanedResponse);
    } catch (error) {
      console.error("Error al comunicarse con Gemini:", error);
      setResponseText("Error al obtener respuesta de Gemini");
    } finally {
      setLoading(false);
    }
  };

  const ChartComponent = () => {
    if (!chartData.length) return null;

    return (
      <View>
        <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 10 }}>
          Resultados de Votación
        </Text>
        {chartData.length > 0 && (
          <BarChart
           data={{
              labels: chartData.map((item) => item.name), // Nombres de los candidatos
              datasets: [{ data: chartData.map((item) => item.votes) }] // Cantidad de votos
            }}
            width={screenWidth - 40} // Ancho del gráfico
            height={300} // Altura del gráfico
            yAxisLabel="" // Puedes poner "Votos: " si lo prefieres
            yAxisSuffix=" Votos" // 🔹 Esto soluciona el error
            chartConfig={{
              backgroundColor: "#1cc910",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efefef",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        )}

      </View>
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Seleccionar archivo Excel" onPress={pickDocument} />

      {selectedRow && (
        <View style={{ marginTop: 20 }}>
          <Button title="Enviar a Gemini" onPress={sendToGemini} />
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />}

      {responseText && (
        <View style={{ marginTop: 20 }}>
          <Text>Respuesta de Gemini:</Text>
          <Text>{responseText}</Text>
        </View>
      )}
      <ChartComponent />
    </View>
  );
}

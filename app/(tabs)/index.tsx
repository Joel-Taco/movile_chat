import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as XLSX from "xlsx";
import * as Clipboard from "expo-clipboard"; // 📌 Importa Clipboard
import { BarChart } from "react-native-chart-kit";

const GEMINI_API_KEY = "AIzaSyDcvdjbtDbtsWyiF2DRgHF8vcQe2pEDTHo"; // 🔴 Reemplaza con tu API Key

export default function ExcelUploader() {
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<{ name: string; votes: number }[]>(
    []
  );
  const screenWidth = Dimensions.get("window").width;

  // 📌 Función para copiar el contenido del Excel
  const copyToClipboard = () => {
    if (!selectedRow) {
      Alert.alert("Error", "No hay datos para copiar.");
      return;
    }

    const jsonData = JSON.stringify(selectedRow, null, 2); // Convierte a JSON
    Clipboard.setStringAsync(jsonData); // Copia al portapapeles
    Alert.alert("Copiado", "Los datos del Excel han sido copiados al portapapeles.");
  };

  // 📌 Función para seleccionar el archivo Excel
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

      setSelectedRow(jsonData);
      Alert.alert(
        "Archivo Cargado",
        "Se ha seleccionado automáticamente la primera fila para análisis."
      );
    } catch (error) {
      console.error("Error al leer el archivo:", error);
      Alert.alert("Error", "No se pudo leer el archivo.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Seleccionar archivo Excel" onPress={pickDocument} />

      {selectedRow && (
        <View style={{ marginTop: 20 }}>
          <Button title="Copiar datos del Excel" onPress={copyToClipboard} /> 
        </View>
      )}
      
      {loading && (
        <ActivityIndicator
          size="large"
          color="black"
          style={{ marginTop: 20 }}
        />
      )}

      {responseText && (
        <View style={{ marginTop: 20 }}>
          <Text>Respuesta de Gemini:</Text>
          <Text>{responseText}</Text>
        </View>
      )}
    </View>
  );
}
import { View, TextInput, Text, Button, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { useState } from 'react';
import { BarChart, PieChart } from "react-native-chart-kit";

// 🔑 API Key de Gemini
const GEMINI_API_KEY = "AIzaSyDcvdjbtDbtsWyiF2DRgHF8vcQe2pEDTHo";  

export default function TabChat() {
  const [messages, setMessages] = useState<{ id: string; content: string; role: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<{ name: string; votes: number }[]>([]);

  const screenWidth = Dimensions.get("window").width;

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Agregar mensaje del usuario al chat
    const newMessage = { id: Date.now().toString(), content: input, role: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setLoading(true); 

    try {
      console.log("📩 Enviando mensaje a Gemini:", input);

      
      const prompt = `Analiza los siguientes comentarios y determina cuántos votos son a favor de Daniel Noboa, Luisa González o nulos. 
      - Asegúrate de que el total de votos sea 100.
      - Si algún voto no se puede identificar, se clasifica como "Nulo".
      - Devuelve ÚNICAMENTE un JSON en este formato: 
      
      {"Daniel Noboa": X, "Luisa González": Y, "Nulo": Z}
      
      Donde:
      - X + Y + Z = 100
      - X e Y son los votos válidos de cada candidato.
      - Z es el total de votos no identificados.

      Comentarios:
      ${input}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const result = await response.json();
      console.log("📤 Respuesta de Gemini:", result);

      const botMessageText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no tengo una respuesta.";

      // Extraer el JSON de la respuesta de Gemini
      const jsonMatch = botMessageText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No se encontró un JSON válido en la respuesta de Gemini.");
      }

      const cleanedResponse = jsonMatch[0]; // Extrae el JSON encontrado
      console.log("🔹 JSON extraído:", cleanedResponse);

      let parsedData;
      try {
        parsedData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("🚨 Error al parsear la respuesta de Gemini:", parseError);
        setMessages(prev => [...prev, { id: Date.now().toString(), content: "Error al analizar los datos.", role: 'bot' }]);
        return;
      }

      // 📌 Convertir los datos JSON en un array para el gráfico
      setChartData([
        { name: "Daniel Noboa", votes: parsedData["Daniel Noboa"] || 0 },
        { name: "Luisa González", votes: parsedData["Luisa González"] || 0 },
        { name: "Nulo", votes: parsedData["Nulo"] || 0 }
      ]);

      // Agregar respuesta del bot al chat
      const botMessage = { id: Date.now().toString(), content: botMessageText, role: 'bot' };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("🚨 Error en el chat:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), content: "Error en la API", role: 'bot' }]);
    } finally {
      setLoading(false); // Ocultar indicador de carga después de recibir la respuesta
    }
  };

  // 📊 Renderizar el gráfico si hay datos
  const ChartComponent = () => {
    if (!chartData.length) return null;

    return (
      <View style={{ marginTop: 20 }}>
        <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 10 }}>
          📊 Distribución de Votos
        </Text>
        <BarChart
          data={{
            labels: chartData.map(item => item.name), // Etiquetas de candidatos
            datasets: [{ data: chartData.map(item => item.votes) }] // Valores de votos
          }}
          width={screenWidth - 40} // Ancho del gráfico
          height={300} // Altura del gráfico
          yAxisLabel=""
          yAxisSuffix=" votos"
          chartConfig={{
            backgroundGradientFrom: "#f4f4f4",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />

        {/* 📌 Gráfico de pastel */}
        <PieChart
          data={chartData.map(item => ({
            name: item.name,
            population: item.votes,
            color: item.name === "Daniel Noboa" ? "blue" :
                   item.name === "Luisa González" ? "red" : "gray",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          }))}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    );
  };

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View className={`flex ${item.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <Text className={`p-2 rounded-lg ${item.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {item.content}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Indicador de carga mientras se espera respuesta de Gemini */}
      {loading && <ActivityIndicator size="large" color="blue" style={{ marginVertical: 10 }} />}

      {/* 📊 Muestra el gráfico cuando hay datos */}
      <ChartComponent />

      <View className="flex flex-row w-full p-2 border-t">
        <TextInput
          className="flex-1 border p-2"
          placeholder="Escribe un mensaje..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Enviar" onPress={handleSendMessage} disabled={loading} />
      </View>
    </View>
  );
}

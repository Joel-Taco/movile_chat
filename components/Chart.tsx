import { View, Text } from "react-native";

export default function Chart (){
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
}
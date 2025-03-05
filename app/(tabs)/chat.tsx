import { View, TextInput, Text, Button, FlatList } from 'react-native';
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { generateAPIUrl } from '@/utils/utils';
import BubbleMessage from '@/components/BubbleMessage';

export default function TabChat() {

  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl('/api/chat'),
    onError: error => console.error(error, 'ERROR'),
  });

  if (error) return <Text>{error.message}</Text>;


  return (
    <View className='flex flex-col h-full p-4'>

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          console.log(item),
          <BubbleMessage message={item.content} type={item.role} />
        )}
        keyExtractor={item => item.id.toString()}
      />

      <View className='flex flex-row w-full'>
        <TextInput
          className='flex-1 border'
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={e =>
            handleInputChange({
              ...e,
              target: {
                ...e.target,
                value: e.nativeEvent.text,
              },
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
          onSubmitEditing={e => {
            handleSubmit(e);
            e.preventDefault();
          }}
          autoFocus={true}
        />
        <Button
          title="Enviar"
          onPress={(e) => {
            handleSubmit(e);
            e.preventDefault();
          }}
        />
      </View>
    </View>

  );
}



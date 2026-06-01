// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   StatusBar,
//   Animated,
//   ActivityIndicator,
// } from 'react-native';
// import { Audio } from 'expo-av';
// import * as FileSystem from 'expo-file-system';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import Text from '../../autoTranslation/AutoText';
// import TextInput from '../../autoTranslation/AutoTextInput';
// import useStore from '../../store/useStore';
// import { sendChatMessage } from '../../services/groqService';
// import { transcribeAudioBase64Api } from '../../services/api';

// function buildWelcomeMessage(name) {
//   const safeName = String(name || '').trim();
//   const greeting = safeName ? `Hello ${safeName}` : 'Hello';
//   return {
//     id: 'ai_welcome',
//     role: 'ai',
//     text: `${greeting}, I am Nari AI.\nI can guide you through this app step by step, help with your account, or answer marketplace questions.`,
//     time: 'Just now',
//   };
// }

// function createTimestampLabel() {
//   return 'Just now';
// }

// function TypingIndicator() {
//   const dot1 = useRef(new Animated.Value(0)).current;
//   const dot2 = useRef(new Animated.Value(0)).current;
//   const dot3 = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const makeBounce = (dot, delay) =>
//       Animated.loop(
//         Animated.sequence([
//           Animated.delay(delay),
//           Animated.timing(dot, { toValue: -6, duration: 280, useNativeDriver: true }),
//           Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: true }),
//           Animated.delay(600),
//         ])
//       );

//     const a1 = makeBounce(dot1, 0);
//     const a2 = makeBounce(dot2, 160);
//     const a3 = makeBounce(dot3, 320);

//     a1.start();
//     a2.start();
//     a3.start();

//     return () => {
//       a1.stop();
//       a2.stop();
//       a3.stop();
//     };
//   }, [dot1, dot2, dot3]);

//   return (
//     <View style={styles.typingWrap}>
//       <View style={styles.avatarBubble}>
//         <Text style={styles.avatarEmoji}>🤖</Text>
//       </View>
//       <View style={styles.typingBubble}>
//         <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]} />
//         <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]} />
//         <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]} />
//       </View>
//     </View>
//   );
// }

// function MessageBubble({ message }) {
//   const isUser = message.role === 'user';

//   return (
//     <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
//       {!isUser && (
//         <View style={styles.avatarBubble}>
//           <Text style={styles.avatarEmoji}>🤖</Text>
//         </View>
//       )}

//       <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
//         {!isUser && <Text style={styles.label}>Nari AI</Text>}
//         <Text style={[styles.messageText, isUser && styles.userMessageText]}>{message.text}</Text>
//         <Text style={[styles.timeText, isUser && styles.userTimeText]}>{message.time}</Text>
//       </View>

//       {isUser && (
//         <View style={styles.userAvatarBubble}>
//           <Text style={styles.avatarEmoji}>👤</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// export default function AIAssistantScreen({ navigation }) {
//   const userName = useStore((state) => state.user?.name || state.user?.fullName || '');
//   const [messages, setMessages] = useState(() => [buildWelcomeMessage(userName)]);
//   const [inputText, setInputText] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [voiceStatus, setVoiceStatus] = useState('');
//   const flatListRef = useRef(null);
//   const messagesRef = useRef(messages);
//   const conversationIdRef = useRef(`nari-ai-${Date.now()}`);
//   const mobileRecordingRef = useRef(null);
//   const webSpeechRecognitionRef = useRef(null);
//   const webSpeechTranscriptRef = useRef('');
//   const webMediaRecorderRef = useRef(null);
//   const webMediaStreamRef = useRef(null);
//   const webChunksRef = useRef([]);
//   const voiceStatusTimerRef = useRef(null);

//   useEffect(() => {
//     messagesRef.current = messages;
//   }, [messages]);

//   useEffect(() => {
//     flatListRef.current?.scrollToEnd({ animated: true });
//   }, [messages.length]);

//   useEffect(() => {
//     setMessages((prev) => {
//       if (prev.length === 1 && prev[0]?.id === 'ai_welcome') {
//         return [buildWelcomeMessage(userName)];
//       }
//       return prev;
//     });
//   }, [userName]);

//   useEffect(() => {
//     if (Platform.OS !== 'web') {
//       (async () => {
//         try {
//           const permission = await Audio.requestPermissionsAsync();
//           if (!permission.granted) {
//             setVoiceStatus('Microphone permission was denied.');
//             if (voiceStatusTimerRef.current) {
//               clearTimeout(voiceStatusTimerRef.current);
//             }
//             voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 3000);
//             return;
//           }

//           await Audio.setAudioModeAsync({
//             allowsRecordingIOS: true,
//             playsInSilentModeIOS: true,
//             shouldDuckAndroid: true,
//           });
//         } catch (error) {
//           setVoiceStatus(error?.message || 'Unable to initialize microphone.');
//         }
//       })();
//     }

//     return () => {
//       if (mobileRecordingRef.current) {
//         try {
//           mobileRecordingRef.current.stopAndUnloadAsync?.();
//         } catch (error) {
//           // no-op
//         }
//         mobileRecordingRef.current = null;
//       }
//       if (webMediaRecorderRef.current && webMediaRecorderRef.current.state !== 'inactive') {
//         try {
//           webMediaRecorderRef.current.stop();
//         } catch (error) {
//           // no-op
//         }
//       }
//       if (webSpeechRecognitionRef.current) {
//         try {
//           webSpeechRecognitionRef.current.onresult = null;
//           webSpeechRecognitionRef.current.onerror = null;
//           webSpeechRecognitionRef.current.onend = null;
//           webSpeechRecognitionRef.current.abort?.();
//         } catch (error) {
//           // no-op
//         }
//         webSpeechRecognitionRef.current = null;
//       }
//       if (webMediaStreamRef.current) {
//         try {
//           webMediaStreamRef.current.getTracks?.().forEach((track) => track.stop());
//         } catch (error) {
//           // no-op
//         }
//         webMediaStreamRef.current = null;
//       }
//       if (voiceStatusTimerRef.current) {
//         clearTimeout(voiceStatusTimerRef.current);
//       }
//     };
//   }, []);

//   const scrollToBottom = useCallback(() => {
//     setTimeout(() => {
//       flatListRef.current?.scrollToEnd({ animated: true });
//     }, 80);
//   }, []);

//   const sendRealReply = useCallback(
//     async (updatedMessages) => {
//       setIsTyping(true);
//       scrollToBottom();

//       try {
//         const result = await sendChatMessage(updatedMessages, {
//           conversationId: conversationIdRef.current,
//           currentScreen: 'AI Assistant',
//         });

//         const nextMessage = {
//           id: `ai_${Date.now()}`,
//           role: 'ai',
//           text: result?.reply || 'I could not generate a reply right now. Please try again.',
//           time: createTimestampLabel(),
//         };

//         setMessages((prev) => [...prev, nextMessage]);
//       } catch (error) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: `ai_err_${Date.now()}`,
//             role: 'ai',
//             text: error?.message || 'I could not generate a reply right now. Please try again.',
//             time: createTimestampLabel(),
//           },
//         ]);
//       } finally {
//         setIsTyping(false);
//         scrollToBottom();
//       }
//     },
//     [scrollToBottom]
//   );

//   const appendUserMessageAndSend = useCallback(
//     (rawText) => {
//       const trimmed = String(rawText || '').trim();
//       if (!trimmed || isTyping) return;

//       const userMessage = {
//         id: `user_${Date.now()}`,
//         role: 'user',
//         text: trimmed,
//         time: createTimestampLabel(),
//       };

//       const updatedMessages = [...messagesRef.current, userMessage];
//       messagesRef.current = updatedMessages;
//       setMessages(updatedMessages);
//       setInputText('');
//       scrollToBottom();
//       sendRealReply(updatedMessages);
//     },
//     [isTyping, scrollToBottom, sendRealReply]
//   );

//   const handleSend = useCallback(() => {
//     appendUserMessageAndSend(inputText);
//   }, [appendUserMessageAndSend, inputText]);

//   const transcribeRecordedUri = useCallback(
//     async (uri) => {
//       if (!uri) {
//         setVoiceStatus('Could not read the recorded audio.');
//         return;
//       }

//       try {
//         setVoiceStatus('Transcribing...');
//         const base64 = await FileSystem.readAsStringAsync(uri, {
//           encoding: 'base64',
//         });
//         const response = await transcribeAudioBase64Api({
//           audioBase64: base64,
//           fileName: 'voice-message.m4a',
//           mimeType: 'audio/m4a',
//         });
//         const transcript = String(response?.text || response?.reply || '').trim();

//         if (!transcript) {
//           setVoiceStatus('No speech detected. Please try again.');
//           if (voiceStatusTimerRef.current) {
//             clearTimeout(voiceStatusTimerRef.current);
//           }
//           voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 2500);
//           return;
//         }

//         setInputText(transcript);
//         setVoiceStatus('Transcript ready.');
//         if (voiceStatusTimerRef.current) {
//           clearTimeout(voiceStatusTimerRef.current);
//         }
//         voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 1200);
//         setTimeout(() => appendUserMessageAndSend(transcript), 160);
//       } catch (error) {
//         setVoiceStatus(error?.message || 'Could not transcribe voice input.');
//         if (voiceStatusTimerRef.current) {
//           clearTimeout(voiceStatusTimerRef.current);
//         }
//         voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 3000);
//       }
//     },
//     [appendUserMessageAndSend]
//   );

//   const transcribeWebBlob = useCallback(
//     (blob) => {
//       if (!blob || blob.size === 0) {
//         setVoiceStatus('No speech detected. Please try again.');
//         if (voiceStatusTimerRef.current) {
//           clearTimeout(voiceStatusTimerRef.current);
//         }
//         voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 2500);
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         try {
//           const result = String(reader.result || '');
//           const base64 = result.includes(',') ? result.split(',')[1] : result;
//           setVoiceStatus('Transcribing...');
//           const response = await transcribeAudioBase64Api({
//             audioBase64: base64,
//             fileName: 'voice-message.webm',
//             mimeType: blob.type || 'audio/webm',
//           });
//           const transcript = String(response?.text || response?.reply || '').trim();

//           if (!transcript) {
//             setVoiceStatus('No speech detected. Please try again.');
//             if (voiceStatusTimerRef.current) {
//               clearTimeout(voiceStatusTimerRef.current);
//             }
//             voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 2500);
//             return;
//           }

//           setInputText(transcript);
//           setVoiceStatus('Transcript ready.');
//           if (voiceStatusTimerRef.current) {
//             clearTimeout(voiceStatusTimerRef.current);
//           }
//           voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 1200);
//           setTimeout(() => appendUserMessageAndSend(transcript), 160);
//         } catch (error) {
//           setVoiceStatus(error?.message || 'Could not transcribe voice input.');
//           if (voiceStatusTimerRef.current) {
//             clearTimeout(voiceStatusTimerRef.current);
//           }
//           voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 3000);
//         }
//       };
//       reader.onerror = () => {
//         setVoiceStatus('Could not read recorded audio.');
//       };
//       reader.readAsDataURL(blob);
//     },
//     [appendUserMessageAndSend]
//   );

//   const startMobileVoiceInput = useCallback(async () => {
//     if (isTyping || isListening) return;

//     try {
//       const permission = await Audio.requestPermissionsAsync();
//       if (!permission.granted) {
//         setVoiceStatus('Microphone permission was denied.');
//         if (voiceStatusTimerRef.current) {
//           clearTimeout(voiceStatusTimerRef.current);
//         }
//         voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 3000);
//         return;
//       }

//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//         shouldDuckAndroid: true,
//       });

//       const recording = new Audio.Recording();
//       await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
//       mobileRecordingRef.current = recording;
//       setIsListening(true);
//       setVoiceStatus('Listening...');
//       await recording.startAsync();
//     } catch (error) {
//       mobileRecordingRef.current = null;
//       setIsListening(false);
//       setVoiceStatus(error?.message || 'Could not start voice input.');
//       if (voiceStatusTimerRef.current) {
//         clearTimeout(voiceStatusTimerRef.current);
//       }
//       voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 3000);
//     }
//   }, [isListening, isTyping]);

//   const stopMobileVoiceInput = useCallback(async () => {
//     const recording = mobileRecordingRef.current;
//     if (!recording) return;

//     setIsListening(false);
//     try {
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI?.();
//       mobileRecordingRef.current = null;
//       if (!uri) {
//         setVoiceStatus('Could not read the recorded audio.');
//         return;
//       }
//       await transcribeRecordedUri(uri);
//     } catch (error) {
//       mobileRecordingRef.current = null;
//       setVoiceStatus(error?.message || 'Could not stop voice input.');
//       if (voiceStatusTimerRef.current) {
//         clearTimeout(voiceStatusTimerRef.current);
//       }
//       voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 3000);
//     }
//   }, [transcribeRecordedUri]);

//   const startWebVoiceInput = useCallback(async () => {
//     if (isTyping || isListening) return;

//     if (typeof window !== 'undefined') {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (SpeechRecognition) {
//         const recognition = new SpeechRecognition();
//         webSpeechTranscriptRef.current = '';
//         recognition.continuous = false;
//         recognition.interimResults = true;
//         recognition.lang = 'en-IN';

//         recognition.onresult = (event) => {
//           let transcript = '';
//           for (let index = 0; index < event.results.length; index += 1) {
//             transcript += event.results[index][0]?.transcript || '';
//           }
//           const cleanTranscript = transcript.trim();
//           webSpeechTranscriptRef.current = cleanTranscript;
//           if (cleanTranscript) {
//             setInputText(cleanTranscript);
//           }
//         };

//         recognition.onerror = (event) => {
//           setIsListening(false);
//           webSpeechRecognitionRef.current = null;
//           setVoiceStatus(event?.error ? `Voice input failed: ${event.error}` : 'Voice input failed.');
//           if (voiceStatusTimerRef.current) {
//             clearTimeout(voiceStatusTimerRef.current);
//           }
//           voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 3000);
//         };

//         recognition.onend = () => {
//           setIsListening(false);
//           webSpeechRecognitionRef.current = null;
//           const transcript = webSpeechTranscriptRef.current.trim();
//           if (!transcript) {
//             setVoiceStatus('No speech detected. Please try again.');
//             if (voiceStatusTimerRef.current) {
//               clearTimeout(voiceStatusTimerRef.current);
//             }
//             voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 2500);
//             return;
//           }
//           setVoiceStatus('Transcript ready.');
//           if (voiceStatusTimerRef.current) {
//             clearTimeout(voiceStatusTimerRef.current);
//           }
//           voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 1200);
//           setTimeout(() => appendUserMessageAndSend(transcript), 160);
//         };

//         webSpeechRecognitionRef.current = recognition;
//         setIsListening(true);
//         setVoiceStatus('Listening...');
//         recognition.start();
//         return;
//       }
//     }

//     if (!navigator?.mediaDevices?.getUserMedia || typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
//       setVoiceStatus('Voice input is not supported in this browser.');
//       if (voiceStatusTimerRef.current) {
//         clearTimeout(voiceStatusTimerRef.current);
//       }
//       voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 3000);
//       return;
//     }

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/webm';
//       const recorder = new MediaRecorder(stream, { mimeType });
//       webChunksRef.current = [];
//       setIsListening(true);
//       setVoiceStatus('Listening...');

//       recorder.ondataavailable = (event) => {
//         if (event.data && event.data.size > 0) {
//           webChunksRef.current.push(event.data);
//         }
//       };

//       recorder.onerror = () => {
//         setIsListening(false);
//         setVoiceStatus('Voice input failed.');
//         if (voiceStatusTimerRef.current) {
//           clearTimeout(voiceStatusTimerRef.current);
//         }
//         voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 3000);
//       };

//       recorder.onstop = () => {
//         setIsListening(false);
//         const blob = new Blob(webChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
//         webChunksRef.current = [];
//         webMediaRecorderRef.current = null;
//         if (webMediaStreamRef.current) {
//           webMediaStreamRef.current.getTracks?.().forEach((track) => track.stop());
//           webMediaStreamRef.current = null;
//         }
//         transcribeWebBlob(blob);
//       };

//       webMediaRecorderRef.current = recorder;
//       webMediaStreamRef.current = stream;
//       recorder.start();
//     } catch (error) {
//       setIsListening(false);
//       setVoiceStatus(error?.message || 'Could not start voice input.');
//       if (voiceStatusTimerRef.current) {
//         clearTimeout(voiceStatusTimerRef.current);
//       }
//       voiceStatusTimerRef.current = setTimeout(() => setVoiceStatus(''), 3000);
//     }
//   }, [appendUserMessageAndSend, isListening, isTyping, transcribeWebBlob]);

//   const stopWebVoiceInput = useCallback(() => {
//     if (webSpeechRecognitionRef.current) {
//       webSpeechRecognitionRef.current.stop?.();
//       return;
//     }

//     const recorder = webMediaRecorderRef.current;
//     if (recorder && recorder.state !== 'inactive') {
//       recorder.stop();
//       return;
//     }
//     setIsListening(false);
//   }, []);

//   const handleMicPress = useCallback(() => {
//     if (Platform.OS === 'web') {
//       if (isListening) {
//         stopWebVoiceInput();
//         return;
//       }
//       startWebVoiceInput();
//       return;
//     }

//     if (isListening || mobileRecordingRef.current) {
//       stopMobileVoiceInput();
//       return;
//     }
//     startMobileVoiceInput();
//   }, [isListening, startMobileVoiceInput, startWebVoiceInput, stopMobileVoiceInput, stopWebVoiceInput]);

//   const renderMessage = useCallback(({ item }) => <MessageBubble message={item} />, []);

//   const listFooter = useCallback(() => (isTyping ? <TypingIndicator /> : null), [isTyping]);

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={COLORS.darkDeep} />

//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//           activeOpacity={0.78}
//           accessibilityLabel="Go back"
//           accessibilityRole="button"
//         >
//           <Text style={styles.backText}>←</Text>
//         </TouchableOpacity>

//         <View style={styles.headerCenter}>
//           <View style={styles.titleRow}>
//             <Text style={styles.headerEmoji}>🤖</Text>
//             <Text style={styles.headerTitle}>AI Assistant</Text>
//           </View>
//           <View style={styles.statusRow}>
//             <View style={styles.statusDot} />
//             <Text style={styles.statusText}>Nari AI · Online</Text>
//           </View>
//         </View>

//         <View style={styles.headerBadge}>
//           <Text style={styles.headerBadgeText}>AI</Text>
//         </View>
//       </View>

//       <View style={styles.headerDivider} />

//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={0}
//       >
//         <FlatList
//           ref={flatListRef}
//           data={messages}
//           renderItem={renderMessage}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.messageList}
//           showsVerticalScrollIndicator={false}
//           ListFooterComponent={listFooter}
//           onContentSizeChange={scrollToBottom}
//           keyboardShouldPersistTaps="handled"
//         />

//         {voiceStatus ? (
//           <View style={styles.voiceStatusWrap}>
//             <Text style={[styles.voiceStatusText, isListening && styles.voiceStatusListening]}>
//               {voiceStatus}
//             </Text>
//           </View>
//         ) : null}

//         <View style={styles.inputBar}>
//           <TouchableOpacity
//             style={styles.micButton}
//             activeOpacity={0.78}
//             onPress={handleMicPress}
//             accessibilityLabel={isListening ? 'Stop voice input' : 'Start voice input'}
//             accessibilityRole="button"
//           >
//             <Text style={[styles.micEmoji, isListening && styles.micEmojiActive]}>
//               {isListening ? '⏹️' : '🎙️'}
//             </Text>
//           </TouchableOpacity>

//           <TextInput
//             style={styles.input}
//             placeholder="Ask me anything..."
//             placeholderTextColor={COLORS.textMuted}
//             value={inputText}
//             onChangeText={setInputText}
//             multiline
//             maxLength={500}
//             returnKeyType="send"
//             blurOnSubmit={false}
//             onSubmitEditing={handleSend}
//           />

//           <TouchableOpacity
//             style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
//             onPress={handleSend}
//             disabled={!inputText.trim() || isTyping}
//             activeOpacity={0.82}
//             accessibilityLabel="Send message"
//             accessibilityRole="button"
//           >
//             {isTyping ? (
//               <ActivityIndicator size="small" color={COLORS.darkDeep} />
//             ) : (
//               <Text style={styles.sendArrow}>↑</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.dark,
//   },
//   flex: {
//     flex: 1,
//     minHeight: 0,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: Platform.OS === 'ios' ? 52 : 44,
//     paddingBottom: 14,
//     paddingHorizontal: 16,
//     backgroundColor: COLORS.darkDeep,
//     ...SHADOWS.medium,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(200,208,228,0.08)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     marginRight: 12,
//   },
//   backText: {
//     fontSize: 20,
//     color: COLORS.textPrimary,
//     fontWeight: '600',
//     marginTop: -1,
//   },
//   headerCenter: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   headerEmoji: {
//     fontSize: 22,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: COLORS.textPrimary,
//     letterSpacing: -0.3,
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//     marginTop: 3,
//   },
//   statusDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: COLORS.success,
//   },
//   statusText: {
//     fontSize: 11,
//     color: COLORS.textMuted,
//     fontWeight: '500',
//   },
//   headerBadge: {
//     backgroundColor: COLORS.primary + '20',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderWidth: 1,
//     borderColor: COLORS.primary + '60',
//     marginLeft: 12,
//   },
//   headerBadgeText: {
//     fontSize: 11,
//     fontWeight: '800',
//     color: COLORS.primary,
//     letterSpacing: 0.8,
//   },
//   headerDivider: {
//     height: 1.5,
//     backgroundColor: COLORS.primary + '30',
//   },
//   messageList: {
//     paddingTop: 16,
//     paddingBottom: 8,
//     flexGrow: 1,
//   },
//   messageRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     paddingHorizontal: 12,
//     marginBottom: 12,
//     maxWidth: '100%',
//   },
//   messageRowUser: {
//     flexDirection: 'row-reverse',
//   },
//   avatarBubble: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: COLORS.darkCard,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 8,
//     flexShrink: 0,
//     borderWidth: 1,
//     borderColor: COLORS.primary + '40',
//   },
//   userAvatarBubble: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: COLORS.primary + '20',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 8,
//     flexShrink: 0,
//     borderWidth: 1,
//     borderColor: COLORS.primary + '50',
//   },
//   avatarEmoji: {
//     fontSize: 16,
//   },
//   bubble: {
//     maxWidth: '75%',
//     borderRadius: 18,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     ...SHADOWS.small,
//   },
//   aiBubble: {
//     backgroundColor: COLORS.darkCard,
//     borderBottomLeftRadius: 4,
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//   },
//   userBubble: {
//     backgroundColor: COLORS.primary,
//     borderBottomRightRadius: 4,
//     borderWidth: 1,
//     borderColor: COLORS.primaryLight,
//   },
//   label: {
//     fontSize: 9,
//     fontWeight: '800',
//     color: COLORS.primary,
//     letterSpacing: 0.8,
//     marginBottom: 4,
//     textTransform: 'uppercase',
//   },
//   messageText: {
//     fontSize: 14,
//     lineHeight: 21,
//     color: COLORS.textSecondary,
//   },
//   userMessageText: {
//     color: COLORS.darkDeep,
//     fontWeight: '500',
//   },
//   timeText: {
//     fontSize: 10,
//     color: COLORS.textMuted,
//     marginTop: 5,
//     textAlign: 'left',
//   },
//   userTimeText: {
//     textAlign: 'right',
//     color: COLORS.darkDeep + 'AA',
//   },
//   typingWrap: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//   },
//   typingBubble: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 18,
//     borderBottomLeftRadius: 4,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//   },
//   typingDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: COLORS.primary,
//     marginHorizontal: 3,
//   },
//   inputBar: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     paddingBottom: Platform.OS === 'ios' ? 28 : 14,
//     backgroundColor: COLORS.darkDeep,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.darkBorder,
//     gap: 10,
//   },
//   voiceStatusWrap: {
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//     marginTop: -2,
//   },
//   voiceStatusText: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//     fontWeight: '600',
//   },
//   voiceStatusListening: {
//     color: COLORS.primary,
//   },
//   micButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: COLORS.darkCard,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     marginBottom: 2,
//     opacity: 0.85,
//   },
//   micEmoji: {
//     fontSize: 18,
//   },
//   micEmojiActive: {
//     color: COLORS.primary,
//   },
//   input: {
//     flex: 1,
//     minHeight: 48,
//     maxHeight: 120,
//     backgroundColor: COLORS.darkCard,
//     color: COLORS.textPrimary,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     fontSize: 15,
//   },
//   sendButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: COLORS.primary,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.primaryLight,
//     marginBottom: 2,
//     ...SHADOWS.small,
//   },
//   sendButtonDisabled: {
//     opacity: 0.55,
//   },
//   sendArrow: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: COLORS.darkDeep,
//     marginTop: -1,
//   },
// });





















// /**
//  * AIAssistantScreen.jsx — Fixed version
//  *
//  * ─── BUGS FIXED ──────────────────────────────────────────────────────────────
//  *
//  * Bug #1 [CRITICAL] — Auto-send after transcription
//  *   BEFORE: transcribeRecordedUri() and transcribeWebBlob() both called
//  *           appendUserMessageAndSend(transcript) inside a setTimeout, which
//  *           silently sent the message without user confirmation.
//  *   AFTER:  Transcripts only call setInputText(transcript). The user must
//  *           press the Send button manually. appendUserMessageAndSend is
//  *           never triggered from the voice path.
//  *
//  * Bug #2 [CRITICAL] — Expo SDK 54: deprecated Audio.Recording constructor
//  *   BEFORE: new Audio.Recording() → prepareToRecordAsync() → startAsync()
//  *           This pattern is removed in SDK 54 and throws or silently fails.
//  *   AFTER:  Audio.Recording.createAsync(preset) — the single, correct SDK 54
//  *           API that creates AND starts recording in one atomic call.
//  *           stopAndUnloadAsync() is called on the returned `recording` object,
//  *           which is the same as before and still works correctly.
//  *
//  * Bug #3 — expo-file-system encoding constant
//  *   BEFORE: FileSystem.readAsStringAsync(uri, { encoding: 'base64' })
//  *           Raw string 'base64' works in most builds but is fragile.
//  *   AFTER:  FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
//  *           Uses the SDK-provided constant, which is the documented SDK 54 way.
//  *
//  * Bug #4 — Race condition: stale isTyping closure in delayed callback
//  *   BEFORE: setTimeout(() => appendUserMessageAndSend(transcript), 160) was
//  *           called 160 ms after transcription. appendUserMessageAndSend reads
//  *           isTyping from its closure at memoization time. If the AI was
//  *           typing during those 160 ms, the guard `if (isTyping) return` would
//  *           silently discard the transcript.
//  *   AFTER:  The 160 ms timeout and auto-send are completely removed (see
//  *           Bug #1). isTyping is only relevant for the Send button, not for
//  *           populating the input field.
//  *
//  * Bug #5 — voiceStatusTimerRef not nulled after clearTimeout
//  *   BEFORE: clearTimeout(voiceStatusTimerRef.current) was called but the ref
//  *           was never set to null, so stale IDs could be re-cleared later.
//  *   AFTER:  voiceStatusTimerRef.current is set to null after every clear, and
//  *           a helper clearVoiceStatusTimer() is used everywhere consistently.
//  *
//  * Bug #6 — Web SpeechRecognition.onend auto-sending
//  *   BEFORE: recognition.onend called appendUserMessageAndSend(transcript)
//  *           directly — same auto-send problem as Bug #1.
//  *   AFTER:  recognition.onend only calls setInputText(transcript) and shows
//  *           a "Transcript ready" status. User presses Send manually.
//  *
//  * Bug #7 — transcribeAudioBase64Api response shape mismatch
//  *   BEFORE: response?.text || response?.reply — the backend DTO has no
//  *           "reply" field. On failure (success=false, error set, text null),
//  *           the code showed "No speech detected" instead of the real error.
//  *   AFTER:  Reads response?.text first, then falls back to response?.error
//  *           for error display, matching the actual AudioTranscriptionResponse
//  *           shape: { success, text, error }.
//  * ─────────────────────────────────────────────────────────────────────────────
//  */

// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   StatusBar,
//   Animated,
//   ActivityIndicator,
// } from 'react-native';
// import { Audio } from 'expo-av';
// import * as FileSystem from 'expo-file-system';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import Text from '../../autoTranslation/AutoText';
// import TextInput from '../../autoTranslation/AutoTextInput';
// import useStore from '../../store/useStore';
// import { sendChatMessage } from '../../services/groqService';
// import { transcribeAudioBase64Api } from '../../services/api';

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function buildWelcomeMessage(name) {
//   const safeName = String(name || '').trim();
//   const greeting = safeName ? `Hello ${safeName}` : 'Hello';
//   return {
//     id: 'ai_welcome',
//     role: 'ai',
//     text: `${greeting}, I am Nari AI.\nI can guide you through this app step by step, help with your account, or answer marketplace questions.`,
//     time: 'Just now',
//   };
// }

// function createTimestampLabel() {
//   return 'Just now';
// }

// // ─── TypingIndicator ──────────────────────────────────────────────────────────

// function TypingIndicator() {
//   const dot1 = useRef(new Animated.Value(0)).current;
//   const dot2 = useRef(new Animated.Value(0)).current;
//   const dot3 = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const makeBounce = (dot, delay) =>
//       Animated.loop(
//         Animated.sequence([
//           Animated.delay(delay),
//           Animated.timing(dot, { toValue: -6, duration: 280, useNativeDriver: true }),
//           Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: true }),
//           Animated.delay(600),
//         ])
//       );

//     const a1 = makeBounce(dot1, 0);
//     const a2 = makeBounce(dot2, 160);
//     const a3 = makeBounce(dot3, 320);

//     a1.start();
//     a2.start();
//     a3.start();

//     return () => {
//       a1.stop();
//       a2.stop();
//       a3.stop();
//     };
//   }, [dot1, dot2, dot3]);

//   return (
//     <View style={styles.typingWrap}>
//       <View style={styles.avatarBubble}>
//         <Text style={styles.avatarEmoji}>🤖</Text>
//       </View>
//       <View style={styles.typingBubble}>
//         <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]} />
//         <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]} />
//         <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]} />
//       </View>
//     </View>
//   );
// }

// // ─── MessageBubble ────────────────────────────────────────────────────────────

// function MessageBubble({ message }) {
//   const isUser = message.role === 'user';

//   return (
//     <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
//       {!isUser && (
//         <View style={styles.avatarBubble}>
//           <Text style={styles.avatarEmoji}>🤖</Text>
//         </View>
//       )}

//       <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
//         {!isUser && <Text style={styles.label}>Nari AI</Text>}
//         <Text style={[styles.messageText, isUser && styles.userMessageText]}>{message.text}</Text>
//         <Text style={[styles.timeText, isUser && styles.userTimeText]}>{message.time}</Text>
//       </View>

//       {isUser && (
//         <View style={styles.userAvatarBubble}>
//           <Text style={styles.avatarEmoji}>👤</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// // ─── Main Screen ──────────────────────────────────────────────────────────────

// export default function AIAssistantScreen({ navigation }) {
//   const userName = useStore((state) => state.user?.name || state.user?.fullName || '');
//   const [messages, setMessages] = useState(() => [buildWelcomeMessage(userName)]);
//   const [inputText, setInputText] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [voiceStatus, setVoiceStatus] = useState('');

//   const flatListRef = useRef(null);
//   const messagesRef = useRef(messages);
//   const conversationIdRef = useRef(`nari-ai-${Date.now()}`);

//   // ── Mobile recording ref (SDK 54: holds the Recording object returned by createAsync) ──
//   const mobileRecordingRef = useRef(null);

//   // ── Web refs ──────────────────────────────────────────────────────────────
//   const webSpeechRecognitionRef = useRef(null);
//   const webSpeechTranscriptRef = useRef('');
//   const webMediaRecorderRef = useRef(null);
//   const webMediaStreamRef = useRef(null);
//   const webChunksRef = useRef([]);

//   // ── Timer ref — always nulled after clear (Bug #5 fix) ────────────────────
//   const voiceStatusTimerRef = useRef(null);

//   // ─── Helper: clear voice status timer safely ──────────────────────────────
//   const clearVoiceStatusTimer = useCallback(() => {
//     if (voiceStatusTimerRef.current !== null) {
//       clearTimeout(voiceStatusTimerRef.current);
//       voiceStatusTimerRef.current = null;
//     }
//   }, []);

//   // ─── Helper: show a timed voice status message ────────────────────────────
//   const showVoiceStatus = useCallback(
//     (message, durationMs = 3000) => {
//       clearVoiceStatusTimer();
//       setVoiceStatus(message);
//       if (durationMs > 0) {
//         voiceStatusTimerRef.current = setTimeout(() => {
//           setVoiceStatus('');
//           voiceStatusTimerRef.current = null;
//         }, durationMs);
//       }
//     },
//     [clearVoiceStatusTimer]
//   );

//   // ─── Sync messagesRef ─────────────────────────────────────────────────────
//   useEffect(() => {
//     messagesRef.current = messages;
//   }, [messages]);

//   // ─── Auto-scroll ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     flatListRef.current?.scrollToEnd({ animated: true });
//   }, [messages.length]);

//   // ─── Re-build welcome message when userName loads ─────────────────────────
//   useEffect(() => {
//     setMessages((prev) => {
//       if (prev.length === 1 && prev[0]?.id === 'ai_welcome') {
//         return [buildWelcomeMessage(userName)];
//       }
//       return prev;
//     });
//   }, [userName]);

//   // ─── Request mic permission on mount (mobile only) ────────────────────────
//   useEffect(() => {
//     if (Platform.OS !== 'web') {
//       (async () => {
//         try {
//           console.log('[Voice] Requesting microphone permission...');
//           const permission = await Audio.requestPermissionsAsync();
//           if (!permission.granted) {
//             console.warn('[Voice] Microphone permission denied.');
//             showVoiceStatus('Microphone permission was denied.');
//             return;
//           }
//           console.log('[Voice] Microphone permission granted.');
//           await Audio.setAudioModeAsync({
//             allowsRecordingIOS: true,
//             playsInSilentModeIOS: true,
//             shouldDuckAndroid: true,
//           });
//           console.log('[Voice] Audio mode configured.');
//         } catch (error) {
//           console.error('[Voice] Permission/audio mode error:', error);
//           showVoiceStatus(error?.message || 'Unable to initialize microphone.');
//         }
//       })();
//     }

//     // ── Cleanup on unmount ────────────────────────────────────────────────
//     return () => {
//       console.log('[Voice] Screen unmounting — cleaning up...');
//       clearVoiceStatusTimer();

//       if (mobileRecordingRef.current) {
//         try {
//           mobileRecordingRef.current.stopAndUnloadAsync?.();
//         } catch (_) { /* no-op */ }
//         mobileRecordingRef.current = null;
//       }

//       if (webMediaRecorderRef.current && webMediaRecorderRef.current.state !== 'inactive') {
//         try {
//           webMediaRecorderRef.current.stop();
//         } catch (_) { /* no-op */ }
//       }

//       if (webSpeechRecognitionRef.current) {
//         try {
//           webSpeechRecognitionRef.current.onresult = null;
//           webSpeechRecognitionRef.current.onerror = null;
//           webSpeechRecognitionRef.current.onend = null;
//           webSpeechRecognitionRef.current.abort?.();
//         } catch (_) { /* no-op */ }
//         webSpeechRecognitionRef.current = null;
//       }

//       if (webMediaStreamRef.current) {
//         try {
//           webMediaStreamRef.current.getTracks?.().forEach((track) => track.stop());
//         } catch (_) { /* no-op */ }
//         webMediaStreamRef.current = null;
//       }
//     };
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   // ─── Scroll helper ────────────────────────────────────────────────────────
//   const scrollToBottom = useCallback(() => {
//     setTimeout(() => {
//       flatListRef.current?.scrollToEnd({ animated: true });
//     }, 80);
//   }, []);

//   // ─── Send message to AI ───────────────────────────────────────────────────
//   const sendRealReply = useCallback(
//     async (updatedMessages) => {
//       setIsTyping(true);
//       scrollToBottom();

//       try {
//         const result = await sendChatMessage(updatedMessages, {
//           conversationId: conversationIdRef.current,
//           currentScreen: 'AI Assistant',
//         });

//         const nextMessage = {
//           id: `ai_${Date.now()}`,
//           role: 'ai',
//           text: result?.reply || 'I could not generate a reply right now. Please try again.',
//           time: createTimestampLabel(),
//         };

//         setMessages((prev) => [...prev, nextMessage]);
//       } catch (error) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: `ai_err_${Date.now()}`,
//             role: 'ai',
//             text: error?.message || 'I could not generate a reply right now. Please try again.',
//             time: createTimestampLabel(),
//           },
//         ]);
//       } finally {
//         setIsTyping(false);
//         scrollToBottom();
//       }
//     },
//     [scrollToBottom]
//   );

//   // ─── Append user message and trigger AI reply ─────────────────────────────
//   const appendUserMessageAndSend = useCallback(
//     (rawText) => {
//       const trimmed = String(rawText || '').trim();
//       if (!trimmed || isTyping) return;

//       const userMessage = {
//         id: `user_${Date.now()}`,
//         role: 'user',
//         text: trimmed,
//         time: createTimestampLabel(),
//       };

//       const updatedMessages = [...messagesRef.current, userMessage];
//       messagesRef.current = updatedMessages;
//       setMessages(updatedMessages);
//       setInputText('');
//       scrollToBottom();
//       sendRealReply(updatedMessages);
//     },
//     [isTyping, scrollToBottom, sendRealReply]
//   );

//   // ─── Send button handler ──────────────────────────────────────────────────
//   const handleSend = useCallback(() => {
//     appendUserMessageAndSend(inputText);
//   }, [appendUserMessageAndSend, inputText]);

//   // ─────────────────────────────────────────────────────────────────────────
//   // MOBILE VOICE — transcribeRecordedUri
//   //
//   // FIX Bug #1: removed appendUserMessageAndSend() call — transcript is now
//   //             only placed in the TextInput. User presses Send manually.
//   // FIX Bug #3: uses FileSystem.EncodingType.Base64 instead of raw 'base64'.
//   // FIX Bug #7: reads response?.text for transcript, response?.error for
//   //             error messages, matching AudioTranscriptionResponse DTO.
//   // ─────────────────────────────────────────────────────────────────────────
//   const transcribeRecordedUri = useCallback(
//     async (uri) => {
//       console.log('[Transcribe Mobile] Starting transcription for URI:', uri);

//       if (!uri) {
//         console.error('[Transcribe Mobile] No URI provided.');
//         showVoiceStatus('Could not read the recorded audio.');
//         return;
//       }

//       try {
//         showVoiceStatus('Transcribing...', 0); // 0 = stays until replaced
//         console.log('[Transcribe Mobile] Reading file as Base64...');

//         // FIX Bug #3 — use the SDK constant instead of raw string
//         const base64 = await FileSystem.readAsStringAsync(uri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });

//         console.log('[Transcribe Mobile] Base64 read OK, length:', base64?.length);
//         console.log('[Transcribe Mobile] Calling transcribeAudioBase64Api...');

//         const response = await transcribeAudioBase64Api({
//           audioBase64: base64,
//           fileName: 'voice-message.m4a',
//           mimeType: 'audio/m4a',
//         });

//         console.log('[Transcribe Mobile] API response:', JSON.stringify(response));

//         // FIX Bug #7 — response shape is { success, text, error }, no "reply"
//         if (!response?.success) {
//           const errMsg = response?.error || 'Transcription failed on server.';
//           console.error('[Transcribe Mobile] Backend error:', errMsg);
//           showVoiceStatus(errMsg);
//           return;
//         }

//         const transcript = String(response?.text || '').trim();
//         console.log('[Transcribe Mobile] Transcript:', transcript);

//         if (!transcript) {
//           console.warn('[Transcribe Mobile] Empty transcript returned.');
//           showVoiceStatus('No speech detected. Please try again.');
//           return;
//         }

//         // FIX Bug #1 — populate TextInput only; do NOT auto-send
//         console.log('[Transcribe Mobile] Setting inputText to transcript.');
//         setInputText(transcript);
//         showVoiceStatus('Transcript ready — press Send ↑', 2000);
//       } catch (error) {
//         console.error('[Transcribe Mobile] Unexpected error:', error);
//         showVoiceStatus(error?.message || 'Could not transcribe voice input.');
//       }
//     },
//     [showVoiceStatus]
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   // WEB VOICE — transcribeWebBlob
//   //
//   // FIX Bug #1: removed appendUserMessageAndSend() call.
//   // FIX Bug #7: reads response?.text / response?.error correctly.
//   // ─────────────────────────────────────────────────────────────────────────
//   const transcribeWebBlob = useCallback(
//     (blob) => {
//       console.log('[Transcribe Web] Starting blob transcription, size:', blob?.size);

//       if (!blob || blob.size === 0) {
//         console.warn('[Transcribe Web] Blob is empty or null.');
//         showVoiceStatus('No speech detected. Please try again.');
//         return;
//       }

//       const reader = new FileReader();

//       reader.onloadend = async () => {
//         try {
//           const result = String(reader.result || '');
//           const base64 = result.includes(',') ? result.split(',')[1] : result;
//           console.log('[Transcribe Web] Base64 ready, length:', base64?.length);

//           showVoiceStatus('Transcribing...', 0);
//           console.log('[Transcribe Web] Calling transcribeAudioBase64Api...');

//           const response = await transcribeAudioBase64Api({
//             audioBase64: base64,
//             fileName: 'voice-message.webm',
//             mimeType: blob.type || 'audio/webm',
//           });

//           console.log('[Transcribe Web] API response:', JSON.stringify(response));

//           // FIX Bug #7 — check success flag, read error field
//           if (!response?.success) {
//             const errMsg = response?.error || 'Transcription failed on server.';
//             console.error('[Transcribe Web] Backend error:', errMsg);
//             showVoiceStatus(errMsg);
//             return;
//           }

//           const transcript = String(response?.text || '').trim();
//           console.log('[Transcribe Web] Transcript:', transcript);

//           if (!transcript) {
//             console.warn('[Transcribe Web] Empty transcript returned.');
//             showVoiceStatus('No speech detected. Please try again.');
//             return;
//           }

//           // FIX Bug #1 — populate TextInput only; do NOT auto-send
//           console.log('[Transcribe Web] Setting inputText to transcript.');
//           setInputText(transcript);
//           showVoiceStatus('Transcript ready — press Send ↑', 2000);
//         } catch (error) {
//           console.error('[Transcribe Web] Unexpected error:', error);
//           showVoiceStatus(error?.message || 'Could not transcribe voice input.');
//         }
//       };

//       reader.onerror = (e) => {
//         console.error('[Transcribe Web] FileReader error:', e);
//         showVoiceStatus('Could not read recorded audio.');
//       };

//       reader.readAsDataURL(blob);
//     },
//     [showVoiceStatus]
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   // MOBILE — startMobileVoiceInput
//   //
//   // FIX Bug #2 — uses Audio.Recording.createAsync() instead of the removed
//   //              new Audio.Recording() + prepareToRecordAsync() + startAsync()
//   //              pattern that was deprecated/removed in Expo SDK 54.
//   // ─────────────────────────────────────────────────────────────────────────
//   const startMobileVoiceInput = useCallback(async () => {
//     if (isTyping || isListening) {
//       console.log('[Voice Mobile] Already listening or typing — ignoring start.');
//       return;
//     }

//     try {
//       console.log('[Voice Mobile] Requesting permissions...');
//       const permission = await Audio.requestPermissionsAsync();
//       if (!permission.granted) {
//         console.warn('[Voice Mobile] Permission denied.');
//         showVoiceStatus('Microphone permission was denied.');
//         return;
//       }

//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//         shouldDuckAndroid: true,
//       });

//       console.log('[Voice Mobile] Starting recording via Audio.Recording.createAsync...');

//       // FIX Bug #2 — SDK 54 API: createAsync returns { recording, status }
//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );

//       mobileRecordingRef.current = recording;
//       setIsListening(true);
//       showVoiceStatus('Listening...', 0);
//       console.log('[Voice Mobile] Recording started successfully.');
//     } catch (error) {
//       console.error('[Voice Mobile] Failed to start recording:', error);
//       mobileRecordingRef.current = null;
//       setIsListening(false);
//       showVoiceStatus(error?.message || 'Could not start voice input.');
//     }
//   }, [isListening, isTyping, showVoiceStatus]);

//   // ─────────────────────────────────────────────────────────────────────────
//   // MOBILE — stopMobileVoiceInput
//   // ─────────────────────────────────────────────────────────────────────────
//   const stopMobileVoiceInput = useCallback(async () => {
//     const recording = mobileRecordingRef.current;
//     if (!recording) {
//       console.warn('[Voice Mobile] stopMobileVoiceInput called but no recording ref found.');
//       return;
//     }

//     setIsListening(false);
//     console.log('[Voice Mobile] Stopping recording...');

//     try {
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI?.();
//       console.log('[Voice Mobile] Recording stopped. URI:', uri);
//       mobileRecordingRef.current = null;

//       if (!uri) {
//         console.error('[Voice Mobile] No URI after stop.');
//         showVoiceStatus('Could not read the recorded audio.');
//         return;
//       }

//       await transcribeRecordedUri(uri);
//     } catch (error) {
//       console.error('[Voice Mobile] Error stopping recording:', error);
//       mobileRecordingRef.current = null;
//       showVoiceStatus(error?.message || 'Could not stop voice input.');
//     }
//   }, [transcribeRecordedUri, showVoiceStatus]);

//   // ─────────────────────────────────────────────────────────────────────────
//   // WEB — startWebVoiceInput
//   //
//   // FIX Bug #6 — SpeechRecognition.onend now only sets inputText, not
//   //              auto-sends. The user must press Send manually.
//   // ─────────────────────────────────────────────────────────────────────────
//   const startWebVoiceInput = useCallback(async () => {
//     if (isTyping || isListening) {
//       console.log('[Voice Web] Already listening or typing — ignoring start.');
//       return;
//     }

//     // ── Path A: Web Speech Recognition API (preferred — no backend round-trip) ──
//     if (typeof window !== 'undefined') {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (SpeechRecognition) {
//         console.log('[Voice Web] Using SpeechRecognition API.');
//         const recognition = new SpeechRecognition();
//         webSpeechTranscriptRef.current = '';
//         recognition.continuous = false;
//         recognition.interimResults = true;
//         recognition.lang = 'en-IN';

//         recognition.onresult = (event) => {
//           let transcript = '';
//           for (let i = 0; i < event.results.length; i += 1) {
//             transcript += event.results[i][0]?.transcript || '';
//           }
//           const clean = transcript.trim();
//           console.log('[Voice Web] Interim/final result:', clean);
//           webSpeechTranscriptRef.current = clean;
//           if (clean) {
//             setInputText(clean);
//           }
//         };

//         recognition.onerror = (event) => {
//           console.error('[Voice Web] SpeechRecognition error:', event?.error);
//           setIsListening(false);
//           webSpeechRecognitionRef.current = null;
//           showVoiceStatus(
//             event?.error ? `Voice input failed: ${event.error}` : 'Voice input failed.'
//           );
//         };

//         // FIX Bug #6 — only setInputText here, never auto-send
//         recognition.onend = () => {
//           console.log('[Voice Web] SpeechRecognition ended.');
//           setIsListening(false);
//           webSpeechRecognitionRef.current = null;
//           const transcript = webSpeechTranscriptRef.current.trim();

//           if (!transcript) {
//             console.warn('[Voice Web] No transcript from SpeechRecognition.');
//             showVoiceStatus('No speech detected. Please try again.');
//             return;
//           }

//           console.log('[Voice Web] Final transcript:', transcript);
//           setInputText(transcript);
//           // FIX Bug #6 — just show status, do NOT call appendUserMessageAndSend
//           showVoiceStatus('Transcript ready — press Send ↑', 2000);
//         };

//         webSpeechRecognitionRef.current = recognition;
//         setIsListening(true);
//         showVoiceStatus('Listening...', 0);
//         recognition.start();
//         console.log('[Voice Web] SpeechRecognition started.');
//         return;
//       }
//     }

//     // ── Path B: MediaRecorder → Groq transcription (fallback for non-Chrome) ──
//     if (
//       !navigator?.mediaDevices?.getUserMedia ||
//       typeof window === 'undefined' ||
//       typeof MediaRecorder === 'undefined'
//     ) {
//       console.error('[Voice Web] MediaRecorder not supported.');
//       showVoiceStatus('Voice input is not supported in this browser.');
//       return;
//     }

//     try {
//       console.log('[Voice Web] Requesting getUserMedia...');
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/webm';
//       const recorder = new MediaRecorder(stream, { mimeType });
//       webChunksRef.current = [];

//       setIsListening(true);
//       showVoiceStatus('Listening...', 0);
//       console.log('[Voice Web] MediaRecorder started with mimeType:', mimeType);

//       recorder.ondataavailable = (event) => {
//         if (event.data && event.data.size > 0) {
//           webChunksRef.current.push(event.data);
//           console.log('[Voice Web] Chunk received, size:', event.data.size);
//         }
//       };

//       recorder.onerror = (e) => {
//         console.error('[Voice Web] MediaRecorder error:', e);
//         setIsListening(false);
//         showVoiceStatus('Voice input failed.');
//       };

//       recorder.onstop = () => {
//         console.log('[Voice Web] MediaRecorder stopped. Chunks:', webChunksRef.current.length);
//         setIsListening(false);
//         const blob = new Blob(webChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
//         console.log('[Voice Web] Blob size:', blob.size);
//         webChunksRef.current = [];
//         webMediaRecorderRef.current = null;
//         if (webMediaStreamRef.current) {
//           webMediaStreamRef.current.getTracks?.().forEach((track) => track.stop());
//           webMediaStreamRef.current = null;
//         }
//         transcribeWebBlob(blob);
//       };

//       webMediaRecorderRef.current = recorder;
//       webMediaStreamRef.current = stream;
//       recorder.start();
//     } catch (error) {
//       console.error('[Voice Web] getUserMedia / MediaRecorder start error:', error);
//       setIsListening(false);
//       showVoiceStatus(error?.message || 'Could not start voice input.');
//     }
//   }, [appendUserMessageAndSend, isListening, isTyping, showVoiceStatus, transcribeWebBlob]); // eslint-disable-line react-hooks/exhaustive-deps

//   // ─────────────────────────────────────────────────────────────────────────
//   // WEB — stopWebVoiceInput
//   // ─────────────────────────────────────────────────────────────────────────
//   const stopWebVoiceInput = useCallback(() => {
//     if (webSpeechRecognitionRef.current) {
//       console.log('[Voice Web] Stopping SpeechRecognition...');
//       webSpeechRecognitionRef.current.stop?.();
//       return;
//     }

//     const recorder = webMediaRecorderRef.current;
//     if (recorder && recorder.state !== 'inactive') {
//       console.log('[Voice Web] Stopping MediaRecorder...');
//       recorder.stop();
//       return;
//     }

//     console.log('[Voice Web] stopWebVoiceInput called but nothing was active.');
//     setIsListening(false);
//   }, []);

//   // ─────────────────────────────────────────────────────────────────────────
//   // Mic button dispatcher
//   // ─────────────────────────────────────────────────────────────────────────
//   const handleMicPress = useCallback(() => {
//     if (Platform.OS === 'web') {
//       if (isListening) {
//         stopWebVoiceInput();
//         return;
//       }
//       startWebVoiceInput();
//       return;
//     }

//     if (isListening || mobileRecordingRef.current) {
//       stopMobileVoiceInput();
//       return;
//     }
//     startMobileVoiceInput();
//   }, [isListening, startMobileVoiceInput, startWebVoiceInput, stopMobileVoiceInput, stopWebVoiceInput]);

//   // ─────────────────────────────────────────────────────────────────────────
//   // Render helpers
//   // ─────────────────────────────────────────────────────────────────────────
//   const renderMessage = useCallback(({ item }) => <MessageBubble message={item} />, []);
//   const listFooter = useCallback(() => (isTyping ? <TypingIndicator /> : null), [isTyping]);

//   // ─────────────────────────────────────────────────────────────────────────
//   // JSX
//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={COLORS.darkDeep} />

//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//           activeOpacity={0.78}
//           accessibilityLabel="Go back"
//           accessibilityRole="button"
//         >
//           <Text style={styles.backText}>←</Text>
//         </TouchableOpacity>

//         <View style={styles.headerCenter}>
//           <View style={styles.titleRow}>
//             <Text style={styles.headerEmoji}>🤖</Text>
//             <Text style={styles.headerTitle}>AI Assistant</Text>
//           </View>
//           <View style={styles.statusRow}>
//             <View style={styles.statusDot} />
//             <Text style={styles.statusText}>Nari AI · Online</Text>
//           </View>
//         </View>

//         <View style={styles.headerBadge}>
//           <Text style={styles.headerBadgeText}>AI</Text>
//         </View>
//       </View>

//       <View style={styles.headerDivider} />

//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={0}
//       >
//         <FlatList
//           ref={flatListRef}
//           data={messages}
//           renderItem={renderMessage}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.messageList}
//           showsVerticalScrollIndicator={false}
//           ListFooterComponent={listFooter}
//           onContentSizeChange={scrollToBottom}
//           keyboardShouldPersistTaps="handled"
//         />

//         {voiceStatus ? (
//           <View style={styles.voiceStatusWrap}>
//             <Text style={[styles.voiceStatusText, isListening && styles.voiceStatusListening]}>
//               {voiceStatus}
//             </Text>
//           </View>
//         ) : null}

//         <View style={styles.inputBar}>
//           <TouchableOpacity
//             style={[styles.micButton, isListening && styles.micButtonActive]}
//             activeOpacity={0.78}
//             onPress={handleMicPress}
//             accessibilityLabel={isListening ? 'Stop voice input' : 'Start voice input'}
//             accessibilityRole="button"
//           >
//             <Text style={[styles.micEmoji, isListening && styles.micEmojiActive]}>
//               {isListening ? '⏹️' : '🎙️'}
//             </Text>
//           </TouchableOpacity>

//           <TextInput
//             style={styles.input}
//             placeholder="Ask me anything..."
//             placeholderTextColor={COLORS.textMuted}
//             value={inputText}
//             onChangeText={setInputText}
//             multiline
//             maxLength={500}
//             returnKeyType="send"
//             blurOnSubmit={false}
//             onSubmitEditing={handleSend}
//           />

//           <TouchableOpacity
//             style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
//             onPress={handleSend}
//             disabled={!inputText.trim() || isTyping}
//             activeOpacity={0.82}
//             accessibilityLabel="Send message"
//             accessibilityRole="button"
//           >
//             {isTyping ? (
//               <ActivityIndicator size="small" color={COLORS.darkDeep} />
//             ) : (
//               <Text style={styles.sendArrow}>↑</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// // ─── Styles (unchanged from original) ────────────────────────────────────────

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.dark,
//   },
//   flex: {
//     flex: 1,
//     minHeight: 0,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: Platform.OS === 'ios' ? 52 : 44,
//     paddingBottom: 14,
//     paddingHorizontal: 16,
//     backgroundColor: COLORS.darkDeep,
//     ...SHADOWS.medium,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(200,208,228,0.08)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     marginRight: 12,
//   },
//   backText: {
//     fontSize: 20,
//     color: COLORS.textPrimary,
//     fontWeight: '600',
//     marginTop: -1,
//   },
//   headerCenter: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   headerEmoji: {
//     fontSize: 22,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: COLORS.textPrimary,
//     letterSpacing: -0.3,
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//     marginTop: 3,
//   },
//   statusDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: COLORS.success,
//   },
//   statusText: {
//     fontSize: 11,
//     color: COLORS.textMuted,
//     fontWeight: '500',
//   },
//   headerBadge: {
//     backgroundColor: COLORS.primary + '20',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderWidth: 1,
//     borderColor: COLORS.primary + '60',
//     marginLeft: 12,
//   },
//   headerBadgeText: {
//     fontSize: 11,
//     fontWeight: '800',
//     color: COLORS.primary,
//     letterSpacing: 0.8,
//   },
//   headerDivider: {
//     height: 1.5,
//     backgroundColor: COLORS.primary + '30',
//   },
//   messageList: {
//     paddingTop: 16,
//     paddingBottom: 8,
//     flexGrow: 1,
//   },
//   messageRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     paddingHorizontal: 12,
//     marginBottom: 12,
//     maxWidth: '100%',
//   },
//   messageRowUser: {
//     flexDirection: 'row-reverse',
//   },
//   avatarBubble: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: COLORS.darkCard,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 8,
//     flexShrink: 0,
//     borderWidth: 1,
//     borderColor: COLORS.primary + '40',
//   },
//   userAvatarBubble: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: COLORS.primary + '20',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 8,
//     flexShrink: 0,
//     borderWidth: 1,
//     borderColor: COLORS.primary + '50',
//   },
//   avatarEmoji: {
//     fontSize: 16,
//   },
//   bubble: {
//     maxWidth: '75%',
//     borderRadius: 18,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     ...SHADOWS.small,
//   },
//   aiBubble: {
//     backgroundColor: COLORS.darkCard,
//     borderBottomLeftRadius: 4,
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//   },
//   userBubble: {
//     backgroundColor: COLORS.primary,
//     borderBottomRightRadius: 4,
//     borderWidth: 1,
//     borderColor: COLORS.primaryLight,
//   },
//   label: {
//     fontSize: 9,
//     fontWeight: '800',
//     color: COLORS.primary,
//     letterSpacing: 0.8,
//     marginBottom: 4,
//     textTransform: 'uppercase',
//   },
//   messageText: {
//     fontSize: 14,
//     lineHeight: 21,
//     color: COLORS.textSecondary,
//   },
//   userMessageText: {
//     color: COLORS.darkDeep,
//     fontWeight: '500',
//   },
//   timeText: {
//     fontSize: 10,
//     color: COLORS.textMuted,
//     marginTop: 5,
//     textAlign: 'left',
//   },
//   userTimeText: {
//     textAlign: 'right',
//     color: COLORS.darkDeep + 'AA',
//   },
//   typingWrap: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//   },
//   typingBubble: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 18,
//     borderBottomLeftRadius: 4,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//   },
//   typingDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: COLORS.primary,
//     marginHorizontal: 3,
//   },
//   inputBar: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     paddingBottom: Platform.OS === 'ios' ? 28 : 14,
//     backgroundColor: COLORS.darkDeep,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.darkBorder,
//     gap: 10,
//   },
//   voiceStatusWrap: {
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//     marginTop: -2,
//   },
//   voiceStatusText: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//     fontWeight: '600',
//   },
//   voiceStatusListening: {
//     color: COLORS.primary,
//   },
//   micButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: COLORS.darkCard,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     marginBottom: 2,
//     opacity: 0.85,
//   },
//   micButtonActive: {
//     borderColor: COLORS.primary,
//     opacity: 1,
//   },
//   micEmoji: {
//     fontSize: 18,
//   },
//   micEmojiActive: {
//     color: COLORS.primary,
//   },
//   input: {
//     flex: 1,
//     minHeight: 48,
//     maxHeight: 120,
//     backgroundColor: COLORS.darkCard,
//     color: COLORS.textPrimary,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     fontSize: 15,
//   },
//   sendButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: COLORS.primary,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.primaryLight,
//     marginBottom: 2,
//     ...SHADOWS.small,
//   },
//   sendButtonDisabled: {
//     opacity: 0.55,
//   },
//   sendArrow: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: COLORS.darkDeep,
//     marginTop: -1,
//   },
// });






























/**
 * AIAssistantScreen.jsx
 *
 * ─── MOBILE VOICE FIX (SDK 54) ───────────────────────────────────────────────
 *
 * ROOT CAUSE of "TypeError: Cannot read property 'Base64' of undefined":
 *
 *   In Expo SDK 54, `import * as FileSystem from 'expo-file-system'` no longer
 *   exposes EncodingType or readAsStringAsync at runtime:
 *
 *   1. EncodingType is re-exported from ExpoFileSystem.types only as a TypeScript
 *      `type` export  (`export { type FileCreateOptions, ... }`). The `type`
 *      keyword is stripped entirely at compile/bundle time — the value is
 *      undefined at runtime.  FileSystem.EncodingType → undefined.
 *      FileSystem.EncodingType.Base64 → TypeError (Cannot read property of
 *      undefined).
 *
 *   2. readAsStringAsync from the main entry point is now a stub inside
 *      legacyWarnings.ts that deliberately throws:
 *        "Method readAsStringAsync is deprecated. Import from
 *         expo-file-system/legacy."
 *
 *   The web voice path (SpeechRecognition / MediaRecorder + FileReader) has
 *   zero dependency on expo-file-system, which is why Chrome always worked.
 *
 * FIX:
 *   Replace `import * as FileSystem from 'expo-file-system'`
 *   with     `import * as FileSystem from 'expo-file-system/legacy'`
 *
 *   The /legacy sub-path is the explicit SDK 54 migration target. It exports
 *   the real readAsStringAsync and the real EncodingType enum
 *   (EncodingType.Base64 = 'base64').
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * All previously documented bug fixes (Bug #1–#7) are retained unchanged.
 * The web voice path is NOT modified.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';

// ─── FIX: import from 'expo-file-system/legacy', NOT 'expo-file-system' ──────
//
// In SDK 54 the main 'expo-file-system' entry point:
//   • exports EncodingType only as a TypeScript `type` — undefined at runtime
//   • stubs readAsStringAsync to throw a deprecation error at runtime
//
// The '/legacy' sub-path is Expo's own documented migration path and correctly
// exports both readAsStringAsync and EncodingType as real runtime values.
// ─────────────────────────────────────────────────────────────────────────────
import * as FileSystem from 'expo-file-system/legacy';

import { COLORS, SHADOWS } from '../../theme/colors';
import Text from '../../autoTranslation/AutoText';
import TextInput from '../../autoTranslation/AutoTextInput';
import useStore from '../../store/useStore';
import { sendChatMessage } from '../../services/groqService';
import { transcribeAudioBase64Api } from '../../services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildWelcomeMessage(name) {
  const safeName = String(name || '').trim();
  const greeting = safeName ? `Hello ${safeName}` : 'Hello';
  return {
    id: 'ai_welcome',
    role: 'ai',
    text: `${greeting}, I am Nari AI.\nI can guide you through this app step by step, help with your account, or answer marketplace questions.`,
    time: 'Just now',
  };
}

function createTimestampLabel() {
  return 'Just now';
}

// ─── TypingIndicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeBounce = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 280, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.delay(600),
        ])
      );

    const a1 = makeBounce(dot1, 0);
    const a2 = makeBounce(dot2, 160);
    const a3 = makeBounce(dot3, 320);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingWrap}>
      <View style={styles.avatarBubble}>
        <Text style={styles.avatarEmoji}>🤖</Text>
      </View>
      <View style={styles.typingBubble}>
        <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]} />
        <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]} />
        <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]} />
      </View>
    </View>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
      {!isUser && (
        <View style={styles.avatarBubble}>
          <Text style={styles.avatarEmoji}>🤖</Text>
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && <Text style={styles.label}>Nari AI</Text>}
        <Text style={[styles.messageText, isUser && styles.userMessageText]}>{message.text}</Text>
        <Text style={[styles.timeText, isUser && styles.userTimeText]}>{message.time}</Text>
      </View>

      {isUser && (
        <View style={styles.userAvatarBubble}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AIAssistantScreen({ navigation }) {
  const userName = useStore((state) => state.user?.name || state.user?.fullName || '');
  const [messages, setMessages] = useState(() => [buildWelcomeMessage(userName)]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');

  const flatListRef = useRef(null);
  const messagesRef = useRef(messages);
  const conversationIdRef = useRef(`nari-ai-${Date.now()}`);

  // ── Mobile recording ref (SDK 54: holds the Recording object from createAsync) ──
  const mobileRecordingRef = useRef(null);

  // ── Web refs ──────────────────────────────────────────────────────────────
  const webSpeechRecognitionRef = useRef(null);
  const webSpeechTranscriptRef = useRef('');
  const webMediaRecorderRef = useRef(null);
  const webMediaStreamRef = useRef(null);
  const webChunksRef = useRef([]);

  // ── Timer ref — always nulled after clear ─────────────────────────────────
  const voiceStatusTimerRef = useRef(null);

  // ─── Helper: clear voice status timer safely ──────────────────────────────
  const clearVoiceStatusTimer = useCallback(() => {
    if (voiceStatusTimerRef.current !== null) {
      clearTimeout(voiceStatusTimerRef.current);
      voiceStatusTimerRef.current = null;
    }
  }, []);

  // ─── Helper: show a timed voice status message ────────────────────────────
  const showVoiceStatus = useCallback(
    (message, durationMs = 3000) => {
      clearVoiceStatusTimer();
      setVoiceStatus(message);
      if (durationMs > 0) {
        voiceStatusTimerRef.current = setTimeout(() => {
          setVoiceStatus('');
          voiceStatusTimerRef.current = null;
        }, durationMs);
      }
    },
    [clearVoiceStatusTimer]
  );

  // ─── Sync messagesRef ─────────────────────────────────────────────────────
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // ─── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  // ─── Re-build welcome message when userName loads ─────────────────────────
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0]?.id === 'ai_welcome') {
        return [buildWelcomeMessage(userName)];
      }
      return prev;
    });
  }, [userName]);

  // ─── Request mic permission on mount (mobile only) ────────────────────────
  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        try {
          console.log('[Voice] Requesting microphone permission...');
          const permission = await Audio.requestPermissionsAsync();
          if (!permission.granted) {
            console.warn('[Voice] Microphone permission denied.');
            showVoiceStatus('Microphone permission was denied.');
            return;
          }
          console.log('[Voice] Microphone permission granted.');
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
          });
          console.log('[Voice] Audio mode configured.');

          // ── SDK 54 import verification log ─────────────────────────────
          // Confirms at runtime that the /legacy import resolved correctly.
          console.log('[Voice] FileSystem import check:');
          console.log('[Voice]   readAsStringAsync type:', typeof FileSystem.readAsStringAsync);
          console.log('[Voice]   EncodingType:', FileSystem.EncodingType);
          console.log('[Voice]   EncodingType.Base64:', FileSystem.EncodingType?.Base64);
        } catch (error) {
          console.error('[Voice] Permission/audio mode error:', error);
          showVoiceStatus(error?.message || 'Unable to initialize microphone.');
        }
      })();
    }

    return () => {
      console.log('[Voice] Screen unmounting — cleaning up...');
      clearVoiceStatusTimer();

      if (mobileRecordingRef.current) {
        try {
          mobileRecordingRef.current.stopAndUnloadAsync?.();
        } catch (_) { /* no-op */ }
        mobileRecordingRef.current = null;
      }

      if (webMediaRecorderRef.current && webMediaRecorderRef.current.state !== 'inactive') {
        try {
          webMediaRecorderRef.current.stop();
        } catch (_) { /* no-op */ }
      }

      if (webSpeechRecognitionRef.current) {
        try {
          webSpeechRecognitionRef.current.onresult = null;
          webSpeechRecognitionRef.current.onerror = null;
          webSpeechRecognitionRef.current.onend = null;
          webSpeechRecognitionRef.current.abort?.();
        } catch (_) { /* no-op */ }
        webSpeechRecognitionRef.current = null;
      }

      if (webMediaStreamRef.current) {
        try {
          webMediaStreamRef.current.getTracks?.().forEach((track) => track.stop());
        } catch (_) { /* no-op */ }
        webMediaStreamRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Scroll helper ────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, []);

  // ─── Send message to AI ───────────────────────────────────────────────────
  const sendRealReply = useCallback(
    async (updatedMessages) => {
      setIsTyping(true);
      scrollToBottom();

      try {
        const result = await sendChatMessage(updatedMessages, {
          conversationId: conversationIdRef.current,
          currentScreen: 'AI Assistant',
        });

        const nextMessage = {
          id: `ai_${Date.now()}`,
          role: 'ai',
          text: result?.reply || 'I could not generate a reply right now. Please try again.',
          time: createTimestampLabel(),
        };

        setMessages((prev) => [...prev, nextMessage]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai_err_${Date.now()}`,
            role: 'ai',
            text: error?.message || 'I could not generate a reply right now. Please try again.',
            time: createTimestampLabel(),
          },
        ]);
      } finally {
        setIsTyping(false);
        scrollToBottom();
      }
    },
    [scrollToBottom]
  );

  // ─── Append user message and trigger AI reply ─────────────────────────────
  const appendUserMessageAndSend = useCallback(
    (rawText) => {
      const trimmed = String(rawText || '').trim();
      if (!trimmed || isTyping) return;

      const userMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        text: trimmed,
        time: createTimestampLabel(),
      };

      const updatedMessages = [...messagesRef.current, userMessage];
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);
      setInputText('');
      scrollToBottom();
      sendRealReply(updatedMessages);
    },
    [isTyping, scrollToBottom, sendRealReply]
  );

  // ─── Send button handler ──────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    appendUserMessageAndSend(inputText);
  }, [appendUserMessageAndSend, inputText]);

  // ─────────────────────────────────────────────────────────────────────────
  // MOBILE VOICE — transcribeRecordedUri
  //
  // FIXED: import changed to 'expo-file-system/legacy' at the top of this
  // file. FileSystem.EncodingType and FileSystem.readAsStringAsync are now
  // real runtime values instead of undefined / a throwing stub.
  //
  // The function body is identical to the SDK 54 fixed version. No auto-send.
  // ─────────────────────────────────────────────────────────────────────────
  const transcribeRecordedUri = useCallback(
    async (uri) => {
      console.log('[Transcribe Mobile] ── START ──────────────────────────────');
      console.log('[Transcribe Mobile] URI received:', uri);

      if (!uri) {
        console.error('[Transcribe Mobile] FAIL: No URI provided.');
        showVoiceStatus('Could not read the recorded audio.');
        return;
      }

      // ── Verify FileSystem imports resolved at runtime ─────────────────────
      // If this log shows EncodingType = undefined you are still importing
      // from 'expo-file-system' (main). Switch to 'expo-file-system/legacy'.
      console.log('[Transcribe Mobile] FileSystem.EncodingType:', FileSystem.EncodingType);
      console.log('[Transcribe Mobile] FileSystem.EncodingType.Base64:', FileSystem.EncodingType?.Base64);
      console.log('[Transcribe Mobile] typeof readAsStringAsync:', typeof FileSystem.readAsStringAsync);

      try {
        showVoiceStatus('Transcribing...', 0); // 0 = stays until replaced

        // ── Step 1: Read the audio file as a Base64 string ─────────────────
        console.log('[Transcribe Mobile] Step 1 — Reading file as Base64...');

        // FileSystem.EncodingType.Base64 === 'base64' from expo-file-system/legacy.
        // Using the constant is preferred; the raw string 'base64' is identical
        // and works as a fallback if the enum somehow fails to resolve.
        const encodingValue = FileSystem.EncodingType?.Base64 ?? 'base64';
        console.log('[Transcribe Mobile] Encoding value used:', encodingValue);

        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: encodingValue,
        });

        // ── Step 2: Confirm Base64 data ────────────────────────────────────
        if (!base64 || base64.length === 0) {
          console.error('[Transcribe Mobile] FAIL: Base64 string is empty after read.');
          showVoiceStatus('Could not read the recorded audio file.');
          return;
        }
        console.log('[Transcribe Mobile] Step 2 — Base64 read OK. Length:', base64.length);

        // ── Step 3: Send to backend ────────────────────────────────────────
        console.log('[Transcribe Mobile] Step 3 — Sending to transcribeAudioBase64Api...');
        console.log('[Transcribe Mobile]   fileName: voice-message.m4a');
        console.log('[Transcribe Mobile]   mimeType: audio/m4a');

        const response = await transcribeAudioBase64Api({
          audioBase64: base64,
          fileName: 'voice-message.m4a',
          mimeType: 'audio/m4a',
        });

        // ── Step 4: Parse backend response ────────────────────────────────
        console.log('[Transcribe Mobile] Step 4 — Backend response received:');
        console.log('[Transcribe Mobile]   success:', response?.success);
        console.log('[Transcribe Mobile]   text:', response?.text);
        console.log('[Transcribe Mobile]   error:', response?.error);

        // Response shape: AudioTranscriptionResponse { success, text, error }
        if (!response?.success) {
          const errMsg = response?.error || 'Transcription failed on server.';
          console.error('[Transcribe Mobile] FAIL: Backend returned success=false. Error:', errMsg);
          showVoiceStatus(errMsg);
          return;
        }

        // ── Step 5: Validate transcript ────────────────────────────────────
        const transcript = String(response?.text || '').trim();
        console.log('[Transcribe Mobile] Step 5 — Transcript value:', JSON.stringify(transcript));

        if (!transcript) {
          console.warn('[Transcribe Mobile] WARN: Empty transcript returned from Groq.');
          showVoiceStatus('No speech detected. Please try again.');
          return;
        }

        // ── Step 6: Populate TextInput (NO auto-send) ──────────────────────
        console.log('[Transcribe Mobile] Step 6 — Calling setInputText with transcript.');
        setInputText(transcript);
        showVoiceStatus('Transcript ready — press Send ↑', 2000);
        console.log('[Transcribe Mobile] ── DONE ── Transcript placed in TextInput.');
      } catch (error) {
        console.error('[Transcribe Mobile] UNEXPECTED ERROR at step unknown:');
        console.error('[Transcribe Mobile]   message:', error?.message);
        console.error('[Transcribe Mobile]   stack:', error?.stack);
        showVoiceStatus(error?.message || 'Could not transcribe voice input.');
      }
    },
    [showVoiceStatus]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // WEB VOICE — transcribeWebBlob  (UNCHANGED — web path works)
  // ─────────────────────────────────────────────────────────────────────────
  const transcribeWebBlob = useCallback(
    (blob) => {
      console.log('[Transcribe Web] Starting blob transcription, size:', blob?.size);

      if (!blob || blob.size === 0) {
        console.warn('[Transcribe Web] Blob is empty or null.');
        showVoiceStatus('No speech detected. Please try again.');
        return;
      }

      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          const result = String(reader.result || '');
          const base64 = result.includes(',') ? result.split(',')[1] : result;
          console.log('[Transcribe Web] Base64 ready, length:', base64?.length);

          showVoiceStatus('Transcribing...', 0);
          console.log('[Transcribe Web] Calling transcribeAudioBase64Api...');

          const response = await transcribeAudioBase64Api({
            audioBase64: base64,
            fileName: 'voice-message.webm',
            mimeType: blob.type || 'audio/webm',
          });

          console.log('[Transcribe Web] API response:', JSON.stringify(response));

          if (!response?.success) {
            const errMsg = response?.error || 'Transcription failed on server.';
            console.error('[Transcribe Web] Backend error:', errMsg);
            showVoiceStatus(errMsg);
            return;
          }

          const transcript = String(response?.text || '').trim();
          console.log('[Transcribe Web] Transcript:', transcript);

          if (!transcript) {
            console.warn('[Transcribe Web] Empty transcript returned.');
            showVoiceStatus('No speech detected. Please try again.');
            return;
          }

          console.log('[Transcribe Web] Setting inputText to transcript.');
          setInputText(transcript);
          showVoiceStatus('Transcript ready — press Send ↑', 2000);
        } catch (error) {
          console.error('[Transcribe Web] Unexpected error:', error);
          showVoiceStatus(error?.message || 'Could not transcribe voice input.');
        }
      };

      reader.onerror = (e) => {
        console.error('[Transcribe Web] FileReader error:', e);
        showVoiceStatus('Could not read recorded audio.');
      };

      reader.readAsDataURL(blob);
    },
    [showVoiceStatus]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // MOBILE — startMobileVoiceInput  (SDK 54: Audio.Recording.createAsync)
  // ─────────────────────────────────────────────────────────────────────────
  const startMobileVoiceInput = useCallback(async () => {
    if (isTyping || isListening) {
      console.log('[Voice Mobile] Already listening or typing — ignoring start.');
      return;
    }

    try {
      console.log('[Voice Mobile] Requesting permissions...');
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        console.warn('[Voice Mobile] Permission denied.');
        showVoiceStatus('Microphone permission was denied.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      console.log('[Voice Mobile] Starting recording via Audio.Recording.createAsync...');

      // SDK 54 API: createAsync returns { recording, status }
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      mobileRecordingRef.current = recording;
      setIsListening(true);
      showVoiceStatus('Listening...', 0);
      console.log('[Voice Mobile] Recording started successfully.');
    } catch (error) {
      console.error('[Voice Mobile] Failed to start recording:', error);
      mobileRecordingRef.current = null;
      setIsListening(false);
      showVoiceStatus(error?.message || 'Could not start voice input.');
    }
  }, [isListening, isTyping, showVoiceStatus]);

  // ─────────────────────────────────────────────────────────────────────────
  // MOBILE — stopMobileVoiceInput
  // ─────────────────────────────────────────────────────────────────────────
  const stopMobileVoiceInput = useCallback(async () => {
    const recording = mobileRecordingRef.current;
    if (!recording) {
      console.warn('[Voice Mobile] stopMobileVoiceInput called but no recording ref found.');
      return;
    }

    setIsListening(false);
    console.log('[Voice Mobile] Stopping recording...');

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI?.();
      console.log('[Voice Mobile] Recording stopped. URI:', uri);
      mobileRecordingRef.current = null;

      if (!uri) {
        console.error('[Voice Mobile] No URI after stop.');
        showVoiceStatus('Could not read the recorded audio.');
        return;
      }

      console.log('[Voice Mobile] Handing URI to transcribeRecordedUri...');
      await transcribeRecordedUri(uri);
    } catch (error) {
      console.error('[Voice Mobile] Error stopping recording:', error);
      mobileRecordingRef.current = null;
      showVoiceStatus(error?.message || 'Could not stop voice input.');
    }
  }, [transcribeRecordedUri, showVoiceStatus]);

  // ─────────────────────────────────────────────────────────────────────────
  // WEB — startWebVoiceInput  (UNCHANGED — web path works)
  // ─────────────────────────────────────────────────────────────────────────
  const startWebVoiceInput = useCallback(async () => {
    if (isTyping || isListening) {
      console.log('[Voice Web] Already listening or typing — ignoring start.');
      return;
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        console.log('[Voice Web] Using SpeechRecognition API.');
        const recognition = new SpeechRecognition();
        webSpeechTranscriptRef.current = '';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i += 1) {
            transcript += event.results[i][0]?.transcript || '';
          }
          const clean = transcript.trim();
          console.log('[Voice Web] Interim/final result:', clean);
          webSpeechTranscriptRef.current = clean;
          if (clean) {
            setInputText(clean);
          }
        };

        recognition.onerror = (event) => {
          console.error('[Voice Web] SpeechRecognition error:', event?.error);
          setIsListening(false);
          webSpeechRecognitionRef.current = null;
          showVoiceStatus(
            event?.error ? `Voice input failed: ${event.error}` : 'Voice input failed.'
          );
        };

        recognition.onend = () => {
          console.log('[Voice Web] SpeechRecognition ended.');
          setIsListening(false);
          webSpeechRecognitionRef.current = null;
          const transcript = webSpeechTranscriptRef.current.trim();

          if (!transcript) {
            console.warn('[Voice Web] No transcript from SpeechRecognition.');
            showVoiceStatus('No speech detected. Please try again.');
            return;
          }

          console.log('[Voice Web] Final transcript:', transcript);
          setInputText(transcript);
          showVoiceStatus('Transcript ready — press Send ↑', 2000);
        };

        webSpeechRecognitionRef.current = recognition;
        setIsListening(true);
        showVoiceStatus('Listening...', 0);
        recognition.start();
        console.log('[Voice Web] SpeechRecognition started.');
        return;
      }
    }

    if (
      !navigator?.mediaDevices?.getUserMedia ||
      typeof window === 'undefined' ||
      typeof MediaRecorder === 'undefined'
    ) {
      console.error('[Voice Web] MediaRecorder not supported.');
      showVoiceStatus('Voice input is not supported in this browser.');
      return;
    }

    try {
      console.log('[Voice Web] Requesting getUserMedia...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      webChunksRef.current = [];

      setIsListening(true);
      showVoiceStatus('Listening...', 0);
      console.log('[Voice Web] MediaRecorder started with mimeType:', mimeType);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          webChunksRef.current.push(event.data);
          console.log('[Voice Web] Chunk received, size:', event.data.size);
        }
      };

      recorder.onerror = (e) => {
        console.error('[Voice Web] MediaRecorder error:', e);
        setIsListening(false);
        showVoiceStatus('Voice input failed.');
      };

      recorder.onstop = () => {
        console.log('[Voice Web] MediaRecorder stopped. Chunks:', webChunksRef.current.length);
        setIsListening(false);
        const blob = new Blob(webChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        console.log('[Voice Web] Blob size:', blob.size);
        webChunksRef.current = [];
        webMediaRecorderRef.current = null;
        if (webMediaStreamRef.current) {
          webMediaStreamRef.current.getTracks?.().forEach((track) => track.stop());
          webMediaStreamRef.current = null;
        }
        transcribeWebBlob(blob);
      };

      webMediaRecorderRef.current = recorder;
      webMediaStreamRef.current = stream;
      recorder.start();
    } catch (error) {
      console.error('[Voice Web] getUserMedia / MediaRecorder start error:', error);
      setIsListening(false);
      showVoiceStatus(error?.message || 'Could not start voice input.');
    }
  }, [appendUserMessageAndSend, isListening, isTyping, showVoiceStatus, transcribeWebBlob]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─────────────────────────────────────────────────────────────────────────
  // WEB — stopWebVoiceInput  (UNCHANGED)
  // ─────────────────────────────────────────────────────────────────────────
  const stopWebVoiceInput = useCallback(() => {
    if (webSpeechRecognitionRef.current) {
      console.log('[Voice Web] Stopping SpeechRecognition...');
      webSpeechRecognitionRef.current.stop?.();
      return;
    }

    const recorder = webMediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      console.log('[Voice Web] Stopping MediaRecorder...');
      recorder.stop();
      return;
    }

    console.log('[Voice Web] stopWebVoiceInput called but nothing was active.');
    setIsListening(false);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Mic button dispatcher
  // ─────────────────────────────────────────────────────────────────────────
  const handleMicPress = useCallback(() => {
    if (Platform.OS === 'web') {
      if (isListening) {
        stopWebVoiceInput();
        return;
      }
      startWebVoiceInput();
      return;
    }

    if (isListening || mobileRecordingRef.current) {
      stopMobileVoiceInput();
      return;
    }
    startMobileVoiceInput();
  }, [isListening, startMobileVoiceInput, startWebVoiceInput, stopMobileVoiceInput, stopWebVoiceInput]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render helpers
  // ─────────────────────────────────────────────────────────────────────────
  const renderMessage = useCallback(({ item }) => <MessageBubble message={item} />, []);
  const listFooter = useCallback(() => (isTyping ? <TypingIndicator /> : null), [isTyping]);

  // ─────────────────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkDeep} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.78}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.titleRow}>
            <Text style={styles.headerEmoji}>🤖</Text>
            <Text style={styles.headerTitle}>AI Assistant</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Nari AI · Online</Text>
          </View>
        </View>

        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>AI</Text>
        </View>
      </View>

      <View style={styles.headerDivider} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={listFooter}
          onContentSizeChange={scrollToBottom}
          keyboardShouldPersistTaps="handled"
        />

        {voiceStatus ? (
          <View style={styles.voiceStatusWrap}>
            <Text style={[styles.voiceStatusText, isListening && styles.voiceStatusListening]}>
              {voiceStatus}
            </Text>
          </View>
        ) : null}

        <View style={styles.inputBar}>
          <TouchableOpacity
            style={[styles.micButton, isListening && styles.micButtonActive]}
            activeOpacity={0.78}
            onPress={handleMicPress}
            accessibilityLabel={isListening ? 'Stop voice input' : 'Start voice input'}
            accessibilityRole="button"
          >
            <Text style={[styles.micEmoji, isListening && styles.micEmojiActive]}>
              {isListening ? '⏹️' : '🎙️'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor={COLORS.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isTyping}
            activeOpacity={0.82}
            accessibilityLabel="Send message"
            accessibilityRole="button"
          >
            {isTyping ? (
              <ActivityIndicator size="small" color={COLORS.darkDeep} />
            ) : (
              <Text style={styles.sendArrow}>↑</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles (unchanged) ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  flex: {
    flex: 1,
    minHeight: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 52 : 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.darkDeep,
    ...SHADOWS.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(200,208,228,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    marginRight: 12,
  },
  backText: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: -1,
  },
  headerCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerEmoji: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  headerBadge: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.primary + '60',
    marginLeft: 12,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  headerDivider: {
    height: 1.5,
    backgroundColor: COLORS.primary + '30',
  },
  messageList: {
    paddingTop: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    marginBottom: 12,
    maxWidth: '100%',
  },
  messageRowUser: {
    flexDirection: 'row-reverse',
  },
  avatarBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.darkCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  userAvatarBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: COLORS.primary + '50',
  },
  avatarEmoji: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...SHADOWS.small,
  },
  aiBubble: {
    backgroundColor: COLORS.darkCard,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },
  userMessageText: {
    color: COLORS.darkDeep,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 5,
    textAlign: 'left',
  },
  userTimeText: {
    textAlign: 'right',
    color: COLORS.darkDeep + 'AA',
  },
  typingWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkCard,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 3,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: COLORS.darkDeep,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkBorder,
    gap: 10,
  },
  voiceStatusWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginTop: -2,
  },
  voiceStatusText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  voiceStatusListening: {
    color: COLORS.primary,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.darkCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    marginBottom: 2,
    opacity: 0.85,
  },
  micButtonActive: {
    borderColor: COLORS.primary,
    opacity: 1,
  },
  micEmoji: {
    fontSize: 18,
  },
  micEmojiActive: {
    color: COLORS.primary,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: COLORS.darkCard,
    color: COLORS.textPrimary,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    marginBottom: 2,
    ...SHADOWS.small,
  },
  sendButtonDisabled: {
    opacity: 0.55,
  },
  sendArrow: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.darkDeep,
    marginTop: -1, 
  },
});
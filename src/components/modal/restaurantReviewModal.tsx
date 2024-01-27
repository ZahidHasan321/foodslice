// ReviewModal.js
import React, { useState } from "react";
import StarRating from "react-native-star-rating-widget"; // Import the star rating component
import { Button, Modal, Text, TextField, TouchableOpacity, View } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";


const ReviewModal = ({ isVisible, onClose, onSubmit }) => {
  const [criteria, setCriteria] = useState({
    service: 0,
    foodQuality: 0,
    ambiance: 0,
    // Add other criteria as needed
  });

  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    // Validate and submit the review
    if (isValid()) {
      onSubmit({ criteria, comment });
      onClose();
    } else {
      // Handle validation error
      Toast.show({
        type:'error',
        text1:"criteria needs to be filled up"
      })
    }
  };

  const isValid = () => {
    // Perform validation logic here
    // For example, check if all criteria are rated
    return Object.values(criteria).every((value) => value !== 0);
  };

  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <View padding-20>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 26, fontWeight: "bold" }}>Add a review</Text>
        <View marginB-20>
          <Text marginB-10>Service</Text>
          <StarRating
            rating={criteria.service}
            onChange={(rating) => setCriteria({ ...criteria, service: rating })}
            maxStars={5}
            starSize={30}
            emptyColor="#D3D3D3"
            color="#FFD700"
          />
        </View>
        <View marginB-20>
          <Text marginB-10>Food Quality</Text>
          <StarRating
            rating={criteria.foodQuality}
            onChange={(rating) =>
              setCriteria({ ...criteria, foodQuality: rating })
            }
            maxStars={5}
            starSize={30}
            emptyColor="#D3D3D3"
            color="#FFD700"
          />
        </View>
        <View marginB-20>
          <Text marginB-10>Ambiance</Text>
          <StarRating
            rating={criteria.ambiance}
            onChange={(rating) =>
              setCriteria({ ...criteria, ambiance: rating })
            }
            maxStars={5}
            starSize={30}
            emptyColor="#D3D3D3"
            color="#FFD700"
          />
        </View>
        {/* Add other criteria star ratings as needed */}
        <TextField
          placeholder="Write a comment..."
          onChangeText={(value) => setComment(value)}
          value={comment}
          multiline
          marginB-20
          style={{
            borderWidth: 1,
            borderRadius: 8,
            padding: 4,
            textAlignVertical: "top",
          }}
          numberOfLines={5}
        />
        <Button
          label="Submit Review"
          backgroundColor="#4CAF50"
          onPress={handleSubmit}
          enableShadow
          marginT-20
        />
      </View>
    </Modal>
  );
};

export default ReviewModal;

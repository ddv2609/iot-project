from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from keras.preprocessing.image import ImageDataGenerator

def train():
    img_width, img_height = 128, 128

    base_dir = '../images'

    train_datagen = ImageDataGenerator(
        rescale=1./255,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2 
    )

    train_generator = train_datagen.flow_from_directory(
        base_dir,
        target_size=(img_width, img_height),
        batch_size=16,
        class_mode='categorical',
        subset='training' 
    )

    validation_generator = train_datagen.flow_from_directory(
        base_dir,
        target_size=(img_width, img_height),
        batch_size=16,
        class_mode='categorical',
        subset='validation'
    )

    # Tạo mô hình
    model = Sequential()
    model.add(Conv2D(32, (3, 3), input_shape=(img_width, img_height, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Conv2D(64, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Conv2D(128, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Flatten())
    model.add(Dense(128, activation='relu'))
    model.add(Dense(2, activation='softmax'))

    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // 16, 
        epochs=10,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // 16
    )

    model.save('face_detection_model.h5')

if __name__ == "__main__":
    train()

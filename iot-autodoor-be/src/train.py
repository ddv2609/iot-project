from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from keras.preprocessing.image import ImageDataGenerator

def train():
    # Kích thước ảnh đầu vào
    img_width, img_height = 128, 128

    # Đường dẫn đến thư mục chứa dữ liệu ảnh
    base_dir = '../images'

    # Tạo generator cho dữ liệu huấn luyện
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2  # Tỉ lệ chia giữa tập validation và tập huấn luyện
    )

    train_generator = train_datagen.flow_from_directory(
        base_dir,
        target_size=(img_width, img_height),
        batch_size=16,
        class_mode='categorical',
        subset='training'  # Chọn 'training' để lấy dữ liệu tập huấn luyện
    )

    # Tạo generator cho dữ liệu validation
    validation_generator = train_datagen.flow_from_directory(
        base_dir,
        target_size=(img_width, img_height),
        batch_size=16,
        class_mode='categorical',
        subset='validation'  # Chọn 'validation' để lấy dữ liệu tập validation
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
    model.add(Dense(2, activation='softmax'))  # 2 là số lớp đầu ra (open và close)

    # Compile mô hình
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    # Huấn luyện mô hình
    model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // 16,  # Batch size là 16
        epochs=10,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // 16
    )

    # Lưu mô hình
    model.save('face_detection_model.h5')

if __name__ == "__main__":
    train()

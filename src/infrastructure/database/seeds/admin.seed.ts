/* Archivo de semilla para crear el usuario administrador */
// Llamada a DataSource de TypeORM para interactuar con la base de datos y realizar operaciones como crear o buscar registros
// Importación de la entidad UserOrmEntity que representa la tabla de usuarios en la base de datos, lo que permite crear y manipular registros de usuarios de manera estructurada y consistente con el modelo de datos definido en la aplicación
// Importación del enum UserRole para asignar el rol de administrador al usuario que se va a crear, lo que garantiza que el usuario tenga los permisos adecuados para realizar tareas administrativas en la aplicación
// Importación de uuidv4 para generar un identificador único para el usuario administrador, lo que asegura que cada usuario tenga un ID único y evita conflictos en la base de datos al crear nuevos registros
import { DataSource } from 'typeorm';
import { UserOrmEntity } from '../typeorm/entities/user.orm-entity';
import { UserRole } from '../../../domain/value-objects/user-role.vo';
import { v4 as uuidv4 } from 'uuid';

// Función asíncrona que se encarga de crear un usuario administrador en la base de datos si no existe, lo que permite asegurar que siempre haya un usuario con privilegios administrativos disponible para gestionar la aplicación, siguiendo las mejores prácticas de seguridad y gestión de usuarios en aplicaciones web
export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(UserOrmEntity);

  // Validación de la existencia de un usuario con el correo electrónico '
  const existing = await userRepo.findOne({
    where: { email: 'admin@jobtalk.com' },
  });

  // Si existe un usuario con el correo electrónico '
  if (existing) {
    console.log('Admin ya existe, saltando seed.');
    return;
  }

  // Caso contrario, se crea un nuevo usuario administrador con los detalles especificados, incluyendo un ID único generado por uuidv4, el correo electrónico '
  const admin = userRepo.create({
    id: uuidv4(),
    email: 'admin@jobtalk.com',
    name: 'Administrador',
    role: UserRole.ADMIN,
    isVerified: true,
    isActive: true,
  });

  await userRepo.save(admin);
  console.log('✅ Admin creado exitosamente');
}
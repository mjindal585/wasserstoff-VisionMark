import * as bcrypt from 'bcrypt';
import UserRepository from '../repositories/user/UserRepository';
import { config } from '../config';
import VersionableRepository from '../repositories/versionable/VersionableRepository';


export default function seedData() {
    const user = new UserRepository();
    user.count()
        .then((res) => {
            if (res === 0) {
                const rawPassword = config.PASSWORD;
                const saltRounds = 10;
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = bcrypt.hashSync(rawPassword, salt);
                const id = VersionableRepository.generateObjectId();
                user.createSeedUser({
                    id: '001',
                    name: 'admin',
                    email: 'admin@google.com',
                    role: 'admin',
                    password: hashedPassword,
                    _id: id,
                    originalId: id
                });
            }
        });
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  //   constructor(
  //     @InjectRepository(Role)
  //     private readonly roleRepository: Repository<Role>,
  //   ) {}
  //   async addRoles(roles: string[]): Promise<Role[]> {
  //     const rls = [];
  //     roles.forEach((rl) => {
  //       rls.push(this.roleRepository.create({ displayName: rl }));
  //     });
  //     const role = await this.roleRepository.save(rls);
  //     return role;
  //   }
}

import {Injectable} from "@main/framework/windowManager/decorators";
import {ServiceSource} from "@main/dataSource/ServiceSource";
import {Project} from "@main/entity/Project";

@Injectable()
export class ProjectService {

	createProject(vo: CreateProjectReqVO) {
		return ServiceSource.getRepository(Project).save(vo)
	}

	getProjectPage(param: PagedParam<string>) {
		return ServiceSource.getRepository(Project).findAndCount({
			skip: (param.pageNo - 1) * param.pageSize,
			take: param.pageSize
		})
	}

	async getProjectById(id: number) {
		return ServiceSource.getRepository(Project).findOneBy({id: id})
	}
}

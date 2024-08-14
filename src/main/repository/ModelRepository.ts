import {Model} from "@main/entity/Model";
import {ServiceSource} from "@main/dataSource/ServiceSource";
import {ModelVersionHistory} from "@main/entity/ModelVersionHistory";
import {DataTableField} from "@main/entity/DataTableField";

export const ModelRepository = ServiceSource.getRepository(Model).extend({
	async publishVersion(modelId: number, releaseVersion: number): Promise<void> {
		// 1. 查询模型的所有属性及其最新版本
		const attributesWithVersions = await this.findModelAttributesWithVersions(modelId);

		// 2. 保存版本信息到 ModelVersionHistory
		const historyRecords = attributesWithVersions.map(attr => ({
			modelId,
			releaseVersion,
			attributeId: attr.id,
			attributeVersion: attr.version, // 使用属性的最新版本号
			attributeJson: JSON.stringify(attr),
		}));

		await this.manager.getRepository(ModelVersionHistory).save(historyRecords);
	},
	async rollbackToVersion(modelId: number, targetReleaseVersion: number): Promise<void> {
		// 1. 查询目标版本的属性版本信息
		const targetVersionAttributes = await this.manager.getRepository(ModelVersionHistory).find({
			where: {modelId, releaseVersion: targetReleaseVersion}
		});

		// 2. 遍历属性，逐个回滚
		for (const targetAttribute of targetVersionAttributes) {
			// 从 attributeJson 中恢复属性值
			const attributeData = JSON.parse(targetAttribute.attributeJson);

			// 更新模型属性
			await this.manager
				.createQueryBuilder()
				.update(Model)
				.set(attributeData) // 使用恢复的属性值
				.where('id = :id', {id: targetAttribute.attributeId})
				.execute();
		}
	},

	// 辅助方法：查询模型的所有属性及其最新版本
	async findModelAttributesWithVersions(modelId: number): Promise<DataTableField[]> {
		// 使用关联查询获取模型属性及其最新版本
		const attributes = await this.manager.getRepository(DataTableField)
			.createQueryBuilder('field')
			.leftJoinAndSelect(
				// 关联查询 ModelVersionHistory，获取每个字段的最新版本信息
				subQuery => {
					return subQuery
						.select('MAX("history"."version")', 'latestVersion') // 获取最新版本号
						.addSelect('"history"."attributeId"', 'attributeId') // 获取版本历史记录中的 attributeId
						.from(ModelVersionHistory, 'history')
						.where('history.modelId = :modelId', {modelId}) // 只查询当前模型的版本历史
						.groupBy('"history"."attributeId"'); // 按照 attributeId 分组，保证每个字段只有一个最新版本
				},
				'latestVersionInfo',
				'"latestVersionInfo"."attributeId" = "field"."id"' // 连接条件：版本历史中的 attributeId 与字段 ID 相等
			)
			.where('field.modelId = :modelId', {modelId}) // 查询条件：只查询当前模型的字段
			.getMany();

		return attributes;
	},

});

export default ModelRepository;

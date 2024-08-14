import {PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn} from "typeorm"

export abstract class BaseDO {

	/**
	 * 主键
	 **/
	@PrimaryGeneratedColumn()
	id: number;

	/**
	 * 创建时间
	 **/
	@CreateDateColumn()
	createTime: Date;

	/**
	 * 更新时间
	 **/
	@UpdateDateColumn()
	updateTime: Date;

	/**
	 * 版本号（自增）
	 **/
	@VersionColumn()
	version: number;
}

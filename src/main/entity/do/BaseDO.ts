import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, VersionColumn} from "typeorm"

@Entity()
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
	 * 版本号
	 **/
	@VersionColumn()
	version: number;
}

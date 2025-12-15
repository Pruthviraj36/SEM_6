create database acadforge;

use acadforge;

create table ProjectType (
	ProjectTypeID int auto_increment primary key,
    ProjectTypeName varchar(100) not null,
    Description text,
    Created datetime not null default current_timestamp,
    Modified datetime not null default current_timestamp on update current_timestamp
);

create table Staff(
	StaffID int auto_increment primary key,
    StaffName varchar(150) not null,
    Phone varchar(20),
    Email varchar(150),
    Password varchar(150) not null,
    Description text,
    Created datetime not null default current_timestamp,
    Modified datetime not null default current_timestamp on update current_timestamp
);

create table Student(
	StudentID int auto_increment primary key,
    StudentName varchar(150) not null,
    Phone varchar(20),
    Email varchar(150),
    Description text,
    Created datetime not null default current_timestamp,
    Modified datetime not null default current_timestamp on update current_timestamp
);

create table ProjectGroup(
	ProjectGroupID int auto_increment primary key,
    ProjectGroupName varchar(150) not null,
    ProjectTypeID int,
    GuideStaffName varchar(150),
    ProjectTitle varchar(255) not null,
    ProjectArea varchar(150),
    ProjectDescription text,
    AverageCPI decimal(4,2),
    ConvenerStaffID int,
    ExpertStaffID int,
    Description text,
    Created datetime not null default current_timestamp,
    Modified datetime not null default current_timestamp on update current_timestamp,
    
    constraint fk_pg_projecttype foreign key (ProjectTypeID) references ProjectType(ProjectTypeID),
    constraint fk_pg_convener foreign key (ConvenerStaffID) references Staff(StaffID),
    constraint fk_pg_expert foreign key (ExpertStaffID) references Staff(StaffID)
);

create table ProjectGroupMember(
	ProjectGroupMemberID int auto_increment primary key,
    ProjectGroupID int not null,
    StudentID int not null,
    IsGroupLeader tinyint(1) not null default 0,
    StudentCGPA decimal(4, 2),
    Description text,
    Created datetime not null default current_timestamp,
    Modified datetime not null default current_timestamp on update current_timestamp,
    
    constraint fk_pgm_group foreign key (ProjectGroupID) references ProjectGroup(ProjectGroupID),
    constraint fk_pgm_student foreign key (StudentID) references Student(StudentID)
);

create table ProjectMeeting(
	ProjectMeetingID int auto_increment primary key,
    ProjectGroupID int not null,
    GuideStaffID int not null,
    MeetingDateTime datetime not null,
    MeetingPurpose varchar(255) not null,
    MeetingLocation varchar(255) not null,
    MeetingNotes text,
	MeetingStatus varchar(50),
    MeetingStatusDescription text,
    MeetingStatusDatetime datetime,
    Description text,
    Created datetime not null default current_timestamp,
    Modified datetime not null default current_timestamp on update current_timestamp,
    
    constraint fk_pm_group foreign key (ProjectGroupID) references ProjectGroup(ProjectGroupID),
    constraint fk_pm_guide foreign key (GuideStaffID) references Staff(StaffID)
);

create table ProjectMeetingAttendance(
	ProjectMeetingAttendanceID int auto_increment primary key,
	ProjectMeetingID int not null,
	StudentID int not null,
    IsPresent tinyint(1) not null default 1,
    AttendanceRemarks varchar(255),
    Description text,
    Created datetime not null default current_timestamp,
    Modified datetime not null default current_timestamp on update current_timestamp,
    
    constraint fk_pma_meeting foreign key (ProjectMeetingID) references ProjectMeeting(ProjectMeetingID),
    constraint fk_pma_student foreign key (StudentID) references Student(StudentID)
);

create table ChangeLog (
  LogID        int auto_increment primary key,
  TableName    varchar(100) not null,
  RecordID     int not null,
  Operation    enum('INSERT','UPDATE','DELETE') not null,
  OldData      json null,
  NewData      json null,
  PerformedAt  datetime not null default current_timestamp
);

alter table Staff modify Password varbinary(255) not null, add constraint uq_staff_email unique (Email);

create table StaffLoginLog (
  LoginLogID   int auto_increment primary key,
  StaffID      int not null,
  LoginTime    datetime not null default current_timestamp,
  IPAddress    varchar(45),
  UserAgent    varchar(255),
  Success      tinyint(1) not null,
  constraint fk_login_staff foreign key (StaffID) references Staff(StaffID)
);

select * from Staff;

SET SQL_SAFE_UPDATES = 0;
DELETE FROM Staff;
SET SQL_SAFE_UPDATES = 1;  -- Re-enable after